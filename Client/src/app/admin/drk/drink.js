angular.module('babar.admin.drink', [
    'babar.server'
])
    .controller('AdmDrinkCtrl', ['$scope', '$state', '$stateParams', 'Server', 'Encode', 'Decode', 'React', function($scope, $state, $stateParams, Server, Encode, Decode, React){
	
	
	this.isReadOnly = true; //when reading existing customers
        this.isWrite = false; //when updating a customer
        this.toWritingMode = function(){
            this.isWrite = true;
            this.isReadOnly = false;
        };
	
	this.current = null;
	
	// init of the current drink
	if($stateParams.id === -1) { // we're in new drink mode
	    this.isReadOnly = false;
	    this.isWrite = false;
        }
        else { // drink already exists
	    Server.read.drink($stateParams.id)
                .then(function(res) {
                    $scope.admdrk.current = Decode.drink(res.data);
                }, function(res) {
                    $state.go('error', {'status':res.status});
                });
        }

	
        this.add = function(){
            $scope.$parent.admin.currentItem = null;
            $state.go('admin.drink', {id:-1});
        };

        this.del = function(){
            //delete current drink
            var func = 'del';
            var args = {
                object: 'drink',
                id: $scope.admdrk.current.id
            };
            var promise = Server.del(args.object, args.id);
            React.toPromise(promise, func, args, function() {
                //refresh drinks' list
                $state.go('admin');
                $scope.admin.getAdminItems('drink');
            });
        };
        
        this.confirm = function(){
            // Confirm only if the form is untouched or touched but valid
            if($scope.drkForm.$valid){
                var func, args, promise;
                if($stateParams.id == -1) { // This confirmation concerns an adding
                    //add blank fields
                    $scope.admdrk.current.id = -1;
                    // react procedure
                    func = 'add';
                    args = {
                        object: 'drink',
                        data: Encode.drink(this.current)
                    };
                    promise = Server.add(args.object, args.data);
                    React.toPromise(promise, func, args, function() {
                        $scope.admdrk.isReadOnly = true;
			$scope.admdrk.isWrite = false;
                        $scope.admin.getAdminItems('drink');
                    });
                }
                else { // This confirmation concerns an update
                    func = 'update';
                    args = {
                        object: 'drink',
                        data: Encode.drink(this.current),
                        id: this.current.id
                    };
                    promise = Server.update(args.object, args.data, args.id);
                    React.toPromise(promise, func, args, function() {
                        $scope.admdrk.isReadOnly = true;
			$scope.admdrk.isWrite = false;
                        $scope.admin.getAdminItems('drink');
                    });
                }
            }
        };

        this.cancel = function(){
            this.isReadOnly = true;
	    this.isWrite = false;
            $scope.admin.getAdminItems('drink');
            if($stateParams.id === -1) {
                $scope.$parent.admin.currentItem = null;
                $state.go('admin');
            }
        };


    }]);
