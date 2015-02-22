var serverIP = '137.194.15.203';

/*
 * When a view asks for some data, there can be two cases.
 * Either the user has the rights to do so, and the view receives it.
 * Or he does not, and has to pass authentication.
 * In the latter case, the promise returned will be the new one, after authentication and automatic retry.
 */

angular
    .module('babar.server', [
	'babar.authenticate',
	'babar.error',
	'ngMaterial',
	'ui.router'
    ])

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

    .factory('Server', function($rootScope, $state, $q, $http, $mdDialog, Encode, Decode, Token){
	Server = function(){
	    
	    //Get current time in millis
	    var time = function(){
		var date = new Date();
		return date.getTime();
	    };

	    // this makes the actual request and handles the response
	    // for more info, read $q's doc
	    var server = function(config) {
		// this deals with every returning promise
		return $http(config)
		    .then(function(promised){
			// success
			return promised;
                    }, function(promised){
			switch(promised.status){
			case 401:
                            // this request went south: login and retry
                            return $mdDialog.show({ 
				templateUrl: 'authenticate/authenticate.tpl.html',
				clickOutsideToClose: false,
				controller: 'AuthenticateCtrl',
				controllerAs: 'auth'
                            }).then(function(promisedAuth) {
				// login went well, now retry but with the token
				promised.config.params.token = promisedAuth.data.value;
				return server(config);
                            });
			case 403:
                            // wrong login/password, handled by auth module
			    return promised;
			case 498:
                            // session has expired, reset token and retry
                            Token.reset();
			    return server(promised.config);
			default:
                            // error
                            $state.go("error", {'status': promised.status});
                            break;
			}
                    });
	    };

	    // this prepares and makes all server's requests and returns a promise
            var request = function(object, params, data){
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
                return server(config);
            };
	    
	    this.list = {
		params: {'action': 'list' },
		customers: function() {
		    return request('customer', this.params);
		},
		drinks: function() {
                    return request('drink', this.params);
		},
		statuses: function() {
                    return request('status', this.params);
                },
		stats: function() {
		    // doesn't exist yet
                    // promise = this.request('stat', this.params);
		}
	    };
            this.create = {
                customer: function(data) {
		    var params = {'action': 'new'};             
                    return request('customer', params, data);
                },
                drink: function(data) {
		    var params = {'action': 'new'};             
                    return request('drink', params, Encode.drink(data));
                },
                purchase: function(data) {
		    var params = {'action': 'new'};             
                    //data.customer bought a data.drink at time()
                    return request('sell', params, Encode.sell(data.customer, data.drink, time()));
                },
		purchase_overdraft: function(data) {
                    var params = {'action': 'new-negative'};		
		    //data.customer bought a data.drink at time()
                    return request('sell', params, Encode.sell(data.customer, data.drink, time()));
                },
                deposit: function(data) {
		    var params = {'action': 'new'};             
                    //data.customer addded data.amount € at time()
                    return request('entry', params, Encode.entry(data.customer, data.amount, time()));
                }
            };
	    this.read = {
                customer: {
                    info: function(id) {
			var params= {
			    action: 'info',
			    id: id
			};
                        return request('customer', params);
                    },
                    balance: function(id) {
			var params= {
                            action: 'balance',
                            id: id
                        };
			return request('customer', params);
                    },
		    totalEntries: function(id) {
			var params= {
                            action: 'total_entries',
                            id: id
                        };
			return request('customer', params);
		    },
		    history: function(id) {
			var params= {
                            action: 'customer_history',
                            id: id
                        };
			return request('sell', params);
		    }
		},
		drink: {
                    info: function(id) {
			var params= {
                            action: 'info',
                            id: id
                        };
			return request('drink', params);
		    }
		},
		status: {
                    info: function(id) {
                        var params= {
                            action: 'info',
                            id: id
                        };
			return request('status', params);
                    }
                }
	    };
	    this.update = {
                params: {'action': 'update'},
		customer: function(data) {
                    this.params.id = data.id;
                    return request('customer', this.params, data);
                },
                drink: function(data) {
                    this.params.id = data.id;
                    return request('drink', this.params, data);
                }
            };
            this.del = {
		params: {'action': 'delete'},
                customer: function(id) {
		    this.params.id = id;
		    return request('customer', this.params);
                },
                drink: function(id) {
                    this.params.id = id;
                    return request('drink', this.params);
                }
            };
	    // the allows one to be logged out
	    this.logout = function() {
		var params = {'action': 'logout'};
		var token = Token.get();
		Token.reset();
		$rootScope.$emit('logout', {});
		$rootScope.$emit('refresh', {'from': 'logout', 'to':'all'});
                return request('customer', params, Encode.logout(token));
	    };
	    // this allows one to be authentified
	    this.authenticate = function(data){
		var params = {'action': 'login'};
		var promise = request('customer', params, Encode.login(data.login, data.password, data.duration));
		promise.then(function(promised) {
		    Token.set(promised.data.value);
		    $rootScope.$emit('login', {'duration': data.duration, 'login': data.login});
		    $rootScope.$emit('refresh', {'from': 'login', 'to':'all'});
                });
                return promise;
	    };
	    this.guiAuthenticate = function() {
		return $mdDialog.show({ 
                    templateUrl: 'authenticate/authenticate.tpl.html',
                    clickOutsideToClose: false,
                    controller: 'AuthenticateCtrl',
                    controllerAs: 'auth'
		});
            };
        };
        return new Server();

    })

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
		    name: drink.type,
		    date: time
		};
	    };
	    this.entry = function(customer, amount, time){
		return {
		    id: 0,
		    debitantId: 1, // TODO
		    customerId: customer.id,
		    amount: amount,
		    date: time
		};
	    };
	    this.login = function(login, password, duration) {
		var time = 0;
                var count = -1;
                if(duration!==0) {
		    time = duration*60*1000;
                }
                else {
                    count = 1;
                }
		return {
                    nickname: login,
                    password: password,
                    expiration: time,
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
