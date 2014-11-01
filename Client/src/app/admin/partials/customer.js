angular.module('babar.admin.customer', [
    'babar.server'
])
    .controller('AdmCustomerCtrl', ['$scope', '$state', '$stateParams', 'Server', function($scope, $state, $stateParams, Server){

	this.isReadOnly = true; //when reading existing customers
	this.isWriteOnly = false; //when creating a customer
        this.toWritingMode = function(){
	    this.isWriteOnly = true;
            this.isReadOnly = false;
            
        };
	
	this.current = null;
	this.statuses = [];
        this.status = null;
	Server.get('status')
	    .then(function(res) {
		res.data.forEach(function(val, ind, arr) {
		    $scope.admcst.statuses.push(val);
		});
		$scope.admcst.status = $scope.admcst.statuses[0];
            });
	
	
	//init of the current customer
	if($stateParams.id === -1){ //we're in new user mode
	    this.isReadOnly = false;
	}else{ //user already exists
            Server.get('customer', $stateParams.id)
                .then(function(res) {
                    $scope.admcst.current = res.data;
                    
                    // set status
		    var status = $scope.admcst.statuses.filter(function(val, ind, arr) {
			return val.id == $scope.admcst.current.statusId;
		    });
		    //initiate to the right status (that complicated 'cause ngOptions understand references instead of values)
                    $scope.admcst.status = $scope.admcst.statuses[$scope.admcst.statuses.indexOf(status[0])];
		    
		    // get balance
		    Server.get('customer', $scope.admcst.current.id, 'balance')
			.then(function(res){
                            $scope.admcst.current.money = res.data.balance;
                        }, function(res) {
			    $state.go('error', {'status':res.status});
			});
		    
                }, function(res) {
		    $state.go('error', {'status':res.status});
		});
        }
	
	this.add = function(){
	    $scope.$parent.admin.currentItem = null;
	    $state.go('admin.customer', {id:-1});
	};

	this.del = function(){
	    //del current user
	    $state.go('admin');
	};
	
	this.confirm = function(){
	    //TODO make a post
	    //Confirm only if the form is untouched or touched but valid
	    if($scope.form.$valid){
		this.isReadOnly = true;
		this.isWriteOnly = false;
	    }
        };

	this.cancel = function(){
	    //TODO make a get
	    this.isReadOnly = true;
	};
	
    }]);
