angular.module('babar.admin.customer', [
    'babar.server'
])
    .controller('AdmCustomerCtrl', ['$scope', '$state', '$stateParams', 'Server', function($scope, $state, $stateParams, Server){

	console.log($scope);
        this.isReadOnly = true;
        this.toWritingMode = function(){
            this.isReadOnly = false;
            
        };
	
	this.current = null;
	this.statuses = ['Customer', 'VIP', 'Barman', 'Barchief'];
	this.status = this.statuses[0];
	
	//init of the current customer
	if($stateParams.id === -1){ //we're in new user mode
	    this.isReadOnly = false;
	}else{ //user exists
            var response = Server.getAdminDetails('customer', $stateParams.id);
            if(response.status !== 200){
		//TODO ('cause a bit extreme)
		$state.go('sell');
            }else{
		response.data.then(function(result){
		    //update the current user
		    $scope.admcst.current = result;
		    //initiate to the right status (that complicated 'cause ngOptions understand references instead of values) TODO: uncomment when ready
		    //$scope.admcst.status = $scope.admcst.statuses[$scope.admcst.statuses.indexOf(result.status)];
		    
		});
            }
	}

	this.add = function(){
	    $scope.$parent.admin.currentItem = null;
	    $state.go('admin.customer', {id:-1});
	};
	
	this.confirm = function(){
	    //TODO make a post
	    //Confirm only if the form is untouched or touched but valid
	    if($scope.form.$pristine || $scope.form.$valid){
		this.isReadOnly = true;
	    }
        };

	this.cancel = function(){
	    //TODO make a get
	    this.isReadOnly = true;
	};
	
    }]);
