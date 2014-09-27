angular.module('babar.admin.customer', [
    'babar.server'
])
    .controller('AdmCustomerCtrl', ['$scope', '$stateParams', 'Server', function($scope, $stateParams, Server){

	
	this.current = null;
	this.statuses = ['Customer', 'VIP', 'Barman', 'Barchief'];
	this.status = this.statuses[0];
	
        var response = Server.getAdminDetails('customer', $stateParams.id);
        if(response.status !== 200){
            //TODO ('cause a bit extreme)
            $state.go('sell');
        }else{
            response.data.then(function(result){
		//update the current user
		$scope.admcst.current = result;
		//initiate to the right status (that complicated 'cause ngOptions understand references instead of values)
		//$scope.admcst.status = $scope.admcst.statuses[$scope.admcst.statuses.indexOf(result.status)];
		
            });
        }
	
        this.isReadOnly = true;
	this.toWritingMode = function(){
	    this.isReadOnly = false;
	    
	};
	
    }]);
