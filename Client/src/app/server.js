var serverIP = '137.194.14.116';

angular.module('babar.server', [
    'babar.authenticate',
    'babar.error',
    'ngDialog'
])
/**
 * This factory is VERY important, because it solves a puzzling issue.
 * In AngularJS, it's the displayed elements that make the API requests to get or post things.
 * Only in our app, some action require authentification.
 * So, display makes a request, no user is logged, a 401 is returned, the user log himself, the request is made again, and the data are returned from the server. However, display this time hasn't requested it, and noone's here to use them.
 * Thus, we need that at every 401 error, the element that made a request waits for an authentication then  retries its request.
 * This process is coded beyond thanks to events (nAuth and yAuth).
 * However, I didn't want to code everywhere the same yAuth event listener, so I centralized the handling of the promises thanks to a callback.
 * It works.
 * The only problem is that it isn't much $q-philosophical to use callbacks, promises should do the job.
 */
    .factory('React', ['$rootScope', '$state', 'Server', function($rootScope, $state, Server) {
	React = function() {
	    // list and destroy yAuth listeners
	    var unregisters = [];
	    $rootScope.$on('yAuthEvent', function(e, a) {
		window.setTimeout(function(){
		    unregisters.forEach(function(val, ind, arr) {
			val();
		    });
		    unregisters = [];
		}, 1000);
	    });

	    this.toPromise = function(promise, func, args, successAction) {
		var recursion = this.toPromise;
		promise.then(function(promised) {// success, do the successAction
                    successAction();
                }, function(promised, some) {
                    if(promised.status == 401) {// not logged, redo when logged
                        var unregister = $rootScope.$on('yAuthEvent', function(e, a) {
			    if(func === 'perform') {
				var newPromise = Server.perform(args);
				recursion(newPromise, func, args, successAction);
			    }
                        });
			unregisters.push(unregister);
                    }
                    else {// unknown state, go on error
                        $state.go('error', {status: promised.status});
                    }
                });
	    };
	    
	};

	return new React();
    }])


// This aim to handle the authentication token
    .factory('Token', [function() {
        function Token() {
            var value = null;
            this.reset = function() {
                value = null;
            };
            this.set = function(token) {
                value = token;
            };
            this.get = function() {
                return value?value:'none';
            };
        }
        return new Token();
    }])

    .filter('react', ['$rootScope', '$q', '$http', '$state', 'ngDialog', 'Token', function($rootScope, $q, $http, $state, ngDialog, Token){
	return function(promise){
	    promise.then(function(response){
		//status is 200
		//everything's allright, moving on
                console.info('ok');
                return response;
		
	    }, function(response){
		switch(response.status){    
		case 401:
		    //fire an nAuth event which will result in a new request from the display as soon as the yAuth event is fired
                    $rootScope.$emit('nAuthEvent', {});
                    console.log('nAuth!');
		    
                    //ask for a login
		    var dialog = ngDialog.open({
			template: 'authenticate/authenticate.tpl.html',
			controller: 'AuthenticateCtrl as auth',
			data: [],
			className: 'ngdialog-theme-plain',
			showClose: false,
			closeByEscape: false,
			closeByDocument: false
		    });
		    dialog.closePromise.then(function(promised){
			console.log(promised.value);
		    });
		    return response;
		    
		case 498:
		    //session has expired, reset token and retry
		    Token.reset();
		    return response;
		    
		case 403:
		    //wrong password, auth will say it, nothing more to be done here
		    return response;
		    
		default:
		    //go on the error page
		    $state.go("error", {'status': response.status});
		    return response;
		    
		}
	    });
	    return promise;
	};
    }])

    .factory('Server', ['$rootScope', '$state', '$q', '$http', 'Encode', 'Decode', 'reactFilter', 'Token', function($rootScope, $state, $q, $http, Encode, Decode, reactFilter, Token){

	Server = function(){
	    
	    //Get current time
	    var time = function(){
		var date = new Date();
		return date.getTime();
	    };
	    
	    this.debug = function(){
		return this.get('customer').then(function(promised){
		    return this.value;
		});
	    };

	    //This prepares and makes all server's requests and returns a promise
	    this.request = function(object, params, data){
		var url = 'http://' + serverIP + '/babar/Server/' + object + '.php';
		params.token = Token.get();
		var config = {
		    'url': url,
		    'params':params
		};
		if(data){
		    config.data = data;
		    config.method = 'POST';
		}else{
		    config.method = 'GET';
		}
		return reactFilter($http(config));
	    };

	    //This regroups all sorts of gets.
	    //id is either the id of a specific object, either 'all'
	    //A promise is returned
	    this.get = function(object, id, specialAction){
		var promise = null;
		if(id){
		    if(specialAction){
			promise = this.request(object, {
			    'action': specialAction,
			    'id': id
			});
		    }else{
			promise = this.request(object, {
			    'action': 'info',
			    'id': id
			});
		    }
		}else{
		    promise = this.request(object, {
			'action': 'list'
		    });   
		}
		return promise;
	    };

	    //This regroups all sorts of posts
	    //A promise is returned
	    this.post = function(object, data, id) {
		var promise = null;
		if(typeof id !== 'undefined') {
		    // are we dealing with a login ?
		    if(id === 0) {
			promise = this.request(object, {
                            'action': 'login'
                        }, data);
		    }
		    // are we dealing with a logout ?
		    else if(id === -1) {
			promise = this.request(object, {
                            'action': 'logout'
                        }, data);
		    }
		    else {
			promise = this.request(object, {
			    'action': 'update',
			    'id': id
			}, data);
		    }
		}
		else {
		    promise = this.request(object, {
			'action': 'new'
		    }, data);
		}
		return promise;
	    };

	    
	    //This aims to link client operations to server ones
	    this.perform = function(args){
		switch(args.action){
		case 'buy':
		    //args.data.customer bought a args.data.drink at time()
		    return this.post('sell', Encode.sell(args.data.customer, args.data.drink, time()));
		case 'deposit':
		    //args.data.customer addded args.data.amount € at time()
		    return this.post('entry', Encode.entry(args.data.customer, args.data.amount, time()));
		case 'logout':
		    return this.post('customer', Encode.logout(Token.get()), -1);

		default:
		    //nothing happens
		    $state.go('error', {status: 405});
		}
	    };

	    //This allow one to be authentified
	    this.authenticate = function(login, password, duration){
		var promise = this.post('customer', Encode.login(login, password, duration), 0);
		var endTime = Encode.loginEndTime(duration);
		promise.then(function(promised) {
		    Token.set(promised.data.value);
		    $rootScope.$emit('yAuthEvent', {login: login, endTime: endTime});
		    console.log('yAuth!');
                });
                return promise;
	    };

	    
	    //FIXME
	    this.getStats = function(){
		var deferred = $q.defer();
		window.setTimeout(
		    function(){
			deferred.resolve([{name: 'pipi le plus loin', id: '0'}, {name: 'caca le plus gros', id: '1'}]);
		    }, 200);
		return deferred.promise;
	    };


	    //FIXME
	    this.getAdminItems = function(domain){
		switch(domain){
		case 'customer':
		    return this.get('customer');
		case 'drink':
		    return this.get('drink');
		case 'user':
		    return {status: 200, data: this.getUsers()};
		case 'stat':
		    return {status: 200, data: this.getStats()};
		default:
		    return {status: 400};
		}
	    };

	    //FIXME
	    this.getAdminDetails = function(domain, id){
		switch(domain){
		case 'customer':
		    return {status: 200, data: this.getCustomerInfo(id)};
		case 'drink':
		    return {status: 200, data: this.getDrinkInfo(id)};
		case 'user':
		    return {status: 200, data: this.getUserInfo(id)};
		case 'stat':
		    return {status: 200, data: this.getStatInfo(id)};
		default:
		    return {status: 400};
		}
	    };

	    //FIXME
	    this.signOut = function(){
		//signout
	    };
	    
	};
	return new Server();

    }])

    .factory('Encode', [function(){

	Encode = function(){

	    this.sell = function(customer, drink, time){
		return {
		    id: 0,
		    customerId: customer.id,
		    drinkId: drink.id,
		    quantity: 1,
		    price: drink.price,
		    brand: drink.brand,
		    name: drink.name,
		    date: time
		};
	    };

	    this.entry = function(customer, amount, time){
		return {
		    id: 0,
		    debitantId: 1,
		    customerId: customer.id,
		    amount: amount,
		    date: time
		};
	    };

	    this.login = function(login, password, duration) {
		var endTime = 0;
                var count = -1;
                if(duration!==0) {
		    endTime = (new Date()).getTime() + duration*60*1000;
                }
                else {
                    count = 1;
                }
		return {
                    nickname: login,
                    password: password,
                    expiration: endTime,
                    actionCount: count
                };
	    };
	    this.loginEndTime = function(duration) {
		return duration===0?duration:(new Date()).getTime() + duration*60*1000;
	    };

	    this.logout = function(token) {
		return {
		    tokenValue: token
		};
	    };
	    
	};
	return new Encode();
    }])


    .factory('Decode', [function(){

	Decode = function(){
	    
	    this.history = function(history){
		return history.map(function(val, ind, arr){
		    return {
			name: val.brand + " " + val.name,
			time: parseInt(val.date, 10),
			price: val.price
		    };
		});
	    };
	};
	return new Decode();
    }]);
