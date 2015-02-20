angular.module('babar.admin.customer', [
    'babar.server'
])
    .controller('AdmCustomerCtrl', ['$scope', '$state', '$stateParams', 'Server', 'Decode', function($scope, $state, $stateParams, Server, Decode){

	$scope.debug = function() {
	    console.log($scope.admcst.current);
	};

	this.state = {
	    list: ['creating', 'reading', 'updating'],
	    current: $stateParams.id === -1 ? 'creating' : 'reading'
	};
	this.state.current = 'updating';
	this.current = null;

	// existing statuses in db
	this.statuses = [];
	Server.list.statuses()
	    .then(function(promised) {
		$scope.admcst.statuses = promised.data;
            });

	this.refresh = function() {
	    var id = $stateParams.id;
	    if(this.state.current === 'reading') {
		Server.read.customer.info(id)
		    .then(function(promised) {
			// set general info
			$scope.admcst.current = Decode.customer(promised.data);
			// set status
			$scope.admcst.current.status = $scope.admcst.statuses.filter(function(val, ind, arr) {
                            return val.id == $scope.admcst.current.statusId;
			});
			// get balance
			Server.read.customer.balance(id)
			    .then(function(promised){
				$scope.admcst.current.money = parseFloat(promised.data.balance);
			    });
		    });
	    }
	};
	/*
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
	*/
	
	// bring it on
	this.refresh();
    }]);
