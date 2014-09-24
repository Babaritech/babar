angular.module('babar.auth', [])

    .factory('Auth', [function(){

	/*
	  This factory aims to keep tabs on the currently logged user,
	  on how long he's still log, and to log/unlog him.
	  There are three levels of auth:
	  _anon (public): only can register sales
	  _barman (user): can regiser sales and move money
	  _barchief (administrator): all rights

	*/
	
	Auth = function(){

	    var userRights = {
		anon: 0,
		barman: 01,
		barchief: 10
	    };
	    
	    var currentlyAuthed = {
		user: null,
		level: userRights.anon,
		endTime: null
		
	    };

	};
	
	return new Auth();

    }]);
