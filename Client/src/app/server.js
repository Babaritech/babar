var serverIP = '137.194.14.116';

angular.module('babar.server', [
    'babar.error',
    'ngDialog'
])

    .factory('StatusResolving', ['$state', function($state){

	StatusResolving = function(){
            this.getMessage = function(status){
		switch(status){
		case 200:
                    return "ok";
		case 403:
                    return "Those are incorrect credentials (login/password).";
		case 401:
                    return "This operation requires an authentication.";
		case 404:
                    return "This content couldn't be found on server.";
		case 400:
                    return "This is a bad request.";
		case 418:
                    return "The server's saying she's a keg.";
		case 409:
		    return "This content already exists on server.";
		case 498:
		    return "This session has expired, please log in.";
		default:
                    return "Ouch! The server encountered an unexpected error.";
		}
            };
	};

	return new StatusResolving();
    }])

    .factory('ServerInterceptor', ['$q', function($q){
	var token =  {
            value: 'none',
            reset: function(){
                this.value = 'none';
            }
	};
        return {
            'request': function(config) {
		console.log('and there too');
		if(config.params){
                    config.params.token = 'none';
		}
                return config;
            },

            'response': function(response) {
		console.log('there');
		switch(response.status){

		case 200:
                    console.log('ok');
                    return response;
                    
                case 401:
                    //ask for login and do it again
                    //When one needs to authenticate himself
		    console.log('here');
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
                    token.reset();
                    return response;
                    
                case 403:
                    //wrong password, auth will say it, nothing more to be done here
                    return response;
                    
                default:
                    //go on the error page
                    $state.go("error", {'status': 500});
                    return response;
		}
	    }
        };

    }])

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('ServerInterceptor');
    }])



    .factory('Server', ['$q', '$http', 'StatusResolving', 'Encode', 'Decode', function($q, $http, StatusResolving, Encode, Decode){

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
		return $http(config);
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
	    this.post = function(object, data, id){
		var promise = null;
                if(id){
                    promise = this.request(object, {
                        'action': 'update',
                        'id': id
                    }, data);
                }else{
                    promise = this.request(object, {
                        'action': 'new'
                    }, data);
		}
		return promise;
	    };

	    
            //This aims to link client operations to server ones
            this.perform = function(action, data){
                switch(action){
                case 'buy':
                    //data.customer bought a data.drink at time()
                    return this.post('sell', Encode.sell(data.customer, data.drink, time()));
                case 'deposit':
                    //data.customer addded data.amount € at time()
                    return this.post('entry', Encode.entry(data.customer, data.amount, time()));
		    
                default:
                    //nothing happens
                    $state.go('error', {status: 500});
                }
            };

	    //This allow one to be authentified
	    this.authenticate = function(login, password, duration){
		var endTime = 0;
		if(duration!==0){
		    endTime = (new Date()).getTime() + duration*60*1000;
		}
		//TODO authentication, delivers the:
		var promise = null; //don't forget to react
		promise.then(function(promised){
		    //if successful, do the sh*t, else reactFilter will handle it
		    if(promised.status === 200){
			//fire an event which will result in the display of the remaining time in the main view, and repeat the initial request
			//TODO handle the token
			$rootScope.$emit('authenticatedEvent', {login: login, endTime: endTime});
                    }
		});
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
