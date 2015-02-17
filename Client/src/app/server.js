var serverIP = '127.0.0.1';//'137.194.14.116';

angular.module('babar.server', [
    'babar.authenticate',
    'babar.error',
    'ngDialog',
    'ui.router'
])
/*
 * When a view asks for some data, there can be two cases.
 * Either the user has the rights to do so, and the view receives it.
 * Or he does not, and has to pass authentication. In the latter case, the view must ask again for the data once the user is legit. Only the server module doesn't know which one asked for it.
 * Thus, whenever a 401 is fired, the server will make the authentication then retry the request and ask all the controllers to refresh the views.
 */

    .factory('ServerState', [function() {
	State = function() {
	    this.cstate = "IDLE";
	    this.states = {
		idle: "IDLE",
		pending: "PENDING"
	    };
	    this.pendingRequest = null;
	};
	return new State();
    }])

    .factory('Token', [function() {
	// This aim to handle the authentication token
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

    .filter('react', ['ServerState', 'Token', 'ngDialog', function(ServerState, Token, ngDialog){
	// we hereby deal with error status codes, especially authentication problems
	return function(promise){

	    var authYourself = function() {
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
            };

	    switch(ServerState.cstate) {
	    case "IDLE":
		promise.then(
		    function(response){
			// success, so still IDLE
			ServerState.cstate = ServerState.states.idle;
			//Server.refresh();
                    },
		    function(response){
			switch(response.status){
			case 401:
			    // let's auth
			    authYourself();
			    ServerState.pendingRequest = response; //.smthg ?
			    ServerState.cstate = ServerState.states.pending;
			    break;
			case 498:
			    // session has expired, reset token and retry
			    Token.reset();
			    // TODO: retry(response)
			    ServerState.cstate = ServerState.states.idle;
			    break;
			default:
			    // error
			    $state.go("error", {'status': response.status});
			    ServerState.cstate = ServerState.states.idle;
			    break;
			}
		    });
		break;
	    case "PENDING":
		promise.then(
		    function(response){
			// success, so we gotta retry what we were doing
			// TODO: retry(ServerState.pendingrequest)
			ServerState.cstate = ServerState.states.idle;
                    },
                    function(response){
			switch(response.status){
			case 403:
			    // wrong password
			    // authenticate module will deal with it
		            ServerState.cstate = ServerState.states.pending;
			    break;
			default:
                            // error
                            $state.go("error", {'status': response.status});
                            ServerState.cstate = ServerState.states.idle;
                            break;
			}
                    });
		break;
	    }
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

	    // this refresh all the controllers
	    this.refresh = function() {
		// TODO: fill it !
		console.log($rootScope);
	    };

	    //This prepares and makes all server's requests and returns a promise
	    this.request = function(object, params, data){
		var url = 'http://' + serverIP + '/Babar/Server/' + object + '.php';
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

	    var server = this;
	    
	    this.list = {
		params: {'action': 'list' },
		customers: function() {
		    return server.request('customer', this.params);
		},
		drinks: function() {
                    return server.request('drink', this.params);
		},
		statuses: function() {
                    return server.request('status', this.params);
                },
		stats: function() {
		    // doesn't exist yet
                    // promise = this.request('stat', this.params);
		}
	    };
            this.create = {
                params: {'action': 'new'},
                customer: function(data) {
                    return request('customer', this.params, data);
                },
                drink: function(data) {
                    return request('drink', this.params, data);
                },
                purchase: function(args) {
                    //args.data.customer bought a args.data.drink at time()
                    return request('sell', this.params, Encode.sell(args.data.customer, args.data.drink, time()));
                },
                deposit: function(args) {
                    //args.data.customer addded args.data.amount € at time()
                    return request('entry', this.params, Encode.entry(args.data.customer, args.data.amount, time()));
                }
            };
	    this.read = {
                customer: {
		    params: {'action': 'info'},
                    info: function(id) {
			this.params.id = id;
                        return server.request('customer', this.params);
                    },
                    balance: function(id) {
                        this.params.id = id;
			this.params.action = 'balance';
			return server.request('customer', this.params);
                    },
		    totalEntries: function(id) {
			this.params.id = id;
			this.params.action = 'total_entries';
			return server.request('customer', this.params);
		    },
		    history: function(id) {
			this.params.id = id;
			this.params.action = 'customer_history';
			return server.request('sell', this.params);
		    }
		},
		drink: {
		    params: {'action': 'info'},         
                    info: function(id) {
			this.params.id = id;
			return server.request('drink', this.params);
		    }
		},
		status: {
		    params: {'action': 'info'},         
                    info: function(id) {
                        this.params.id = id;
                        return server.request('status', this.params);
                    }
                }
	    };
	    this.update = {
                params: {'action': 'update'},
		client: function(data) {
                    this.params.id = data.id;
                    return this.request('customer', this.params, data);
                },
                drink: function(data) {
                    this.params.id = data.id;
                    return this.request('drink', this.params, data);
                }
            };
            this.del = {
		params: {'action': 'delete'},
                client: function(id) {
		    this.params.id = id;
		    return this.request('customer', this.params);
                },
                drink: function(id) {
                    this.params.id = id;
                    return this.request('drink', this.params);
                }
            };
	    // the allows one to be logged out
	    this.logout = function() {
		var params = {'action': 'logout'};
		return this.request('customer', params, Encode.logout(Token.get()));
	    };
	    // this allows one to be authentified
	    this.authenticate = function(login, password, duration){
		var promise = this.post('customer', Encode.login(login, password, duration), 'login');
		var endTime = Encode.loginEndTime(duration);
		promise.then(function(promised) {
		    Token.set(promised.data.value);
                });
                return promise;
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
	    this.drink = function(drink) {
		var nDrink = drink;
                nDrink.name = drink.type;
                return nDrink;
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
	    this.customer = function(customer) {
		var nCustomer = customer;
                nCustomer.name = customer.firstname + " ("+ customer.nickname + ") " + customer.lastname;
                return nCustomer;
            };
	    this.customers = function(customers) {
		var mut = this.customer;
		return customers.map(function(val, ind, arr){
		    mut(val);
                    return val;
                });
	    };
	    this.drink = function(drink) {
		var nDrink = drink;
		nDrink.type = drink.name;
                nDrink.name = drink.brand + " " + drink.type;
                nDrink.price = parseFloat(drink.price, 10);
                return nDrink;
            };
	    this.drinks = function(drinks) {
		var mut = this.drink;
		return drinks.map(function(val, ind, arr) {
		    mut(val);
		    return val;
		});
	    };
	};
	return new Decode();
    }]);
