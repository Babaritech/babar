angular.module('babar.rights', [
'babar.server'
])

    .factory('Rights', ['$rootScope', 'Server', function($rootScope, Server){

	/*
	  This factory aims to keep tabs on the currently logged user,
	  on how long he's still logged, and to log/unlog him.
	  There are three levels of auth:
	  _anon (public): only can register sales (level 0)
	  _barman (user): can regiser sales and move money (level 1)
	  _barchief (administrator): all rights (level 2)
	  When a barman or a barchief choose to extend his rights for a given time, only level 2 is exentended (administration always needs a fresh authentication)
	*/
	
	Rights = function(){

	    var current = {
		user: null,
		endTime: null,
		reset: function(){
                    this.user = null;
                    this.endTime = null;
		}
	    };

	    
	    this.can = function(){
		var time = (new Date()).getTime();
		return current.user!==null && time<current.endTime;
	    };

	    //ask some rights for a given login/password for duration (in minutes)
	    //if duration===0, it's just for one time
	    this.ask = function(login, password, duration, isAdminRights){
		var endTime = 0;
		if(duration!==0){
		    endTime = (new Date()).getTime() + duration*60*1000;
		}
		current.reset();
		var level = 1;
		if(isAdminRights){
		    level = 2;
		}
		var response = Server.authenticate(level, login, password, duration);
		if(response==='ok' && endTime){
                    current.user = login;
                    current.endTime = endTime;
		    //tell main page to display that
		    $rootScope.$emit('authenticatedEvent', {login: login, endTime: endTime});
                }
		return response;
	    };
	};
	
	return new Rights();
    }]);
