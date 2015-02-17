angular.module('babar.admin.drink', [
    'babar.server'
])
    .controller('AdmDrinkCtrl', ['$scope', '$state', '$stateParams', 'Server', function($scope, $state, $stateParams, Server){
	//id price name volume enabled
	this.isReadOnly = true;
	this.toWritingMode = function(){
	    this.isReadOnly = false;
	};
	
	this.current = null;
	
	//init of the current customer
	if($stateParams.id === -1){ //we're in new user mode
	    this.isReadOnly = false;
	}else{ //user exists
	    var response = Server.getAdminDetails('drink', $stateParams.id);
	    if(response.status !== 200){
		//TODO ('cause a bit extreme)
		$state.go('sell');
		    }else{
			response.data.then(function(result){
			    //update the current user
			    $scope.admdrk.current = result;
			    
			});
		    }
		}
	
	this.add = function(){
	    $scope.$parent.admin.currentItem = null;
	    $state.go('admin.drink', {id:-1});
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
