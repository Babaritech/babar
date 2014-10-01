angular.module('babar.error', [
    'babar.server'
])

    .controller('ErrorCtrl', ['StatusResolving', '$stateParams', function(StatusResolving, $stateParams){

	this.status = $stateParams.status;
	this.message = StatusResolving.getMessage(this.status); 
	
    }]);
