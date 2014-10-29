angular.module('babar.error', [
])
    .factory('Status', ['$stateParams', function($stateParams){

        Status = function(){
	    this.getStatus = function(){
	        return $stateParams.status;
	    };
	    
            this.getMessage = function(){
                switch(this.getStatus()){
                case '200':
                    return "ok";
                case '403':
                    return "Those are incorrect credentials (login/password).";
                case '401':
                    return "This operation requires an authentication.";
                case '404':
                    return "This content couldn't be found on server.";
                case '400':
                    return "This is a bad request. Please contact an admin.";
                case '418':
                    return "The server's saying she's a keg.";
                case '409':
                    return "This content already exists on server.";
                case '498':
                    return "This session has expired, please log in.";
                default:
                    return "Ouch! The server encountered an unexpected error.";
                }
            };
        };

        return new Status();
    }])

    .controller('ErrorCtrl', ['Status', function(Status){

	this.status = Status.getStatus();
	this.message = Status.getMessage();
	
    }]);
