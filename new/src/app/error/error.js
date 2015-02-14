angular.module('babar.error', [
])
    .factory('Status', ['$stateParams', function($stateParams){

        Status = function(){
	    this.getStatus = function(){
		if($stateParams.status) {
	            return $stateParams.status;
		}
		else {
		    return '500';
		}
	    };
	    
            this.getMessage = function() {
                switch(this.getStatus().toString()) {
                case '200':
                    return "Everything's allright.";
                case '400':
                    return "This is a bad request.";
                case '401':
                    return "This operation requires an authentication.";
                case '403':
                    return "Those are incorrect credentials (login/password).";
                case '404':
                    return "This content couldn't be found on server.";
		case '405':
		    return "Ouch! The client encountered an unexpected error.";
                case '409':
                    return "This content already exists on server.";
                case '418':
                    return "The server's saying she's a keg.";
		case '420':
		    return "The app didn't meet the user's expectations.";
                case '498':
                    return "This session has expired, please log in.";
                default:
		    return "Ouch! The application encountered an unexpected error.";
                }
            };

	    this.isContactNeeded = function() {
		switch(this.getStatus().toString()) {
                case '200':
                    return false;
                case '400':
                    return true;
                case '401':
                    return false;
                case '403':
                    return false;
                case '404':
                    return false;
                case '405':
                    return true;
                case '409':
                    return false;
                case '418':
                    return false;
		case '420':
		    return true;
                case '498':
                    return false;
                default:
                    return true;
                }
            };
        };

        return new Status();
    }])

    .controller('ErrorCtrl', ['Status', function(Status){

	this.status = Status.getStatus();
	this.message = Status.getMessage();
	this.needToContact = Status.isContactNeeded();
	
    }]);
