var serverIP = '137.194.14.116';

angular.module('babar.server', [
    'babar.error'
])

    .factory('StatusResolving', ['$state', function($state){

	StatusResolving = function(){
            this.getMessage = function(status){
		switch(status){
		case 200:
                    return "ok";
		case 403 :
                    return "Those are incorrect credentials (login/password).";
		case 401 :
                    return "This operation requires an authentication.";
		case 404 :
                    return "This content couldn't be found on server.";
		case 400 :
                    return "This is a bad request.";
		case 418 :
                    return "The server's saying she's a keg.";
		case 409 :
		    return "This content already exists on server.";
		default:
                    return "Ouch! The server encountered an unexpected error.";
		}
            };

	    this.act = function(status){
		if(status !== 200){
		    $state.go("error", {'status': status});
		}
	    };
	};

	return new StatusResolving();
    }])

    .factory('Server', ['$q', '$http', 'StatusResolving', function($q, $http, StatusResolving){

	//TODO: implement real server communication
	
	Server = function(){

	    var time = function(){
		var date = new Date();
		return date.getTime();
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
		if(id){
		    if(specialAction){
			return this.request(object, {
                            'action': specialAction,
			    'id': id
                        });
		    }else{
			return this.request(object, {
			    'action': 'info',
			    'id': id
			});
		    }
		}else{
		    return this.request(object, {
			'action': 'list'
		    });   
                }
	    };

	    //This regroups all sorts of posts
            //A promise is returned                                                                    
            this.post = function(object, data, id){                                            
                if(id){                                                                                
                    return this.request(object, {                                                  
                        'action': 'update',
                        'id': id                                                              
                    }, data);                                                                       
                }else{                                                            
                    return this.request(object, {                                                  
                        'action': 'new'
                    }, data);                                                                            
		}
	    };

	    
	    this.getStats = function(){
		var deferred = $q.defer();
                window.setTimeout(
                    function(){
                        deferred.resolve([{name: 'pipi le plus loin', id: '0'}, {name: 'caca le plus gros', id: '1'}]);
                    }, 200);
                return deferred.promise;
	    };

	    this.perform = function(action, data){
		var status;
		switch(action){
		case 'buy':
		    //data.customer bought a data.drink at time()
		    console.log('debug');
		    console.log(data);
		    return this.post('sell', {'customer': data.customer, 'drink': data.drink, 'time': time});
		case 'deposit':
		    //data.customer addded data.data.amount € at time()
		    return this.post('entry', {'customer': data.customer, 'amount': data.data.amount, 'time': time});
		default:
		    //nothing happens
		    status = 400;
		    break;
		}
		return StatusResolving.getMessage(status);
	    };
	    
		this.authenticate = function(level, login, password, duration){
		    //authenticate the user here
		    return StatusResolving.getMessage(200);
		};

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
		customerId: customer.id,
		drinkId: drink.id,
		quantity: 1,
		date: time
	    };
	};

	this.entry = function(customer, amount, time){
	    return {
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
			time: val.date,
			price: val.price
		    };
		});
	    };
	    
	};
	return new Decode();
    }]);
