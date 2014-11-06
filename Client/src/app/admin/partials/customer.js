angular.module('babar.admin.customer', [
    'babar.server'
])
    .controller('AdmCustomerCtrl', ['$scope', '$state', '$stateParams', 'Server', 'Decode', 'React', function($scope, $state, $stateParams, Server, Decode, React){

	$scope.debug = function(arg) {
	    console.log(arg);
	};
	
	this.isReadOnly = true; //when reading existing customers
	this.isWrite = false; //when updating a customer
        this.toWritingMode = function(){
	    this.isWrite = true;
            this.isReadOnly = false;
        };
	
	this.current = null;
	this.statuses = [];
        this.status = null;
	this.updateStatusId = function() {
	    this.current.statusId = this.status.id;
	};
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
	    this.isWrite = false;
	}
	else{ //user already exists
            Server.get('customer', $stateParams.id)
                .then(function(res) {
                    $scope.admcst.current = Decode.customer(res.data);
                    
                    // set status
		    var status = $scope.admcst.statuses.filter(function(val, ind, arr) {
			return val.id == $scope.admcst.current.statusId;
		    });
		    //initiate to the right status (that complicated 'cause ngOptions understand references instead of values)
                    $scope.admcst.status = $scope.admcst.statuses[$scope.admcst.statuses.indexOf(status[0])];
		    
		    // get balance
		    Server.get('customer', $scope.admcst.current.id, 'balance')
			.then(function(res){
                            $scope.admcst.current.money = parseFloat(res.data.balance);
                        }, function(res) {
			    $state.go('error', {'status':res.status});
			});
		    
                }, function(res) {
		    $state.go('error', {'status':res.status});
		});
        }
	
	this.add = function(){
	    // Before all, update current.statusId according to the current status
            this.updateStatusId();
            $scope.$parent.admin.currentItem = null;
            $state.go('admin.customer', {id:-1});
	};

	this.del = function(){
	    //delete current user (to be confirmed by a password)
	    var func = 'del';
            var args = {
                object: 'customer',
		id: $scope.admcst.current.id
            };
	    var promise = Server.del(args.object, args.id);
            React.toPromise(promise, func, args, function() {
	        //refresh customers' list
                $state.go('admin');
		$scope.admin.getAdminItems('customer');
            });
	};
	
	this.confirm = function(){
	    // Before all, update current.statusId according to the current status
	    this.updateStatusId();
	    // Confirm only if the form is untouched or touched but valid
	    if($scope.cstForm.$valid){
		var func, args, promise;
		if($stateParams.id == -1) { // The confirmation concerns an adding
		    //add blank fields
		    $scope.admcst.current.id = -1;
                    $scope.admcst.current.password = 'none';
		    // react procedure
		    func = 'add';
                    args = {
			object: 'customer',
			data: this.current
                    };
		    promise = Server.add(args.object, args.data);
                    React.toPromise(promise, func, args, function() {
                        $scope.admcst.isReadOnly = true;
                        $scope.admcst.isWrite = false;
			$scope.admin.getAdminItems('customer');
                    });
		}
		else { // The confirmation concerns an update
		    func = 'update';
                    args = {
                        object: 'customer',
                        data: this.current,
			id: this.current.id
                    };
		    promise = Server.update(args.object, args.data, args.id);
                    React.toPromise(promise, func, args, function() {
                        $scope.admcst.isReadOnly = true;
			$scope.admcst.isWrite = false;
                        $scope.admin.getAdminItems('customer');
                    });
		}
	    }
        };

	this.cancel = function(){
	    this.isReadOnly = true;
	    this.isWrite = false;
	    $scope.admin.getAdminItems('customer');
            if($stateParams.id === -1) {
		$scope.$parent.admin.currentItem = null;
		$state.go('admin');
            }
	};
	
    }]);
