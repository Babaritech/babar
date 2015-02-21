angular.module('babar.admin.customer', [
    'babar.server',
    'babar.error',
    'ngMaterial'
])
    .controller('AdmCustomerCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$mdBottomSheet', 'Server', 'Decode', function($rootScope, $scope, $state, $stateParams, $mdBottomSheet, Server, Decode){

	$scope.debug = function() {
	    console.log($scope.admcst.state);
	};

	// FSM for the current customer
	var states = {
            CREATING: 'creating',
            READING: 'reading',
            UPDATING: 'updating'
        };
	this.state = {
	    current: $stateParams.id === "-1" ? states.CREATING : states.READING,
	    buttonChanged: function() {
		// the effect of the button depends on the current state
		switch(this.current){
		case 'creating':
		    // no effect
		    break;
		case 'reading':
		    // go to update mode
		    this.current = states.UPDATING;
		    this.button = true;
		    break;
		case 'updating':
		    // go back to read mode
		    this.current = states.READING;
		    this.button = false;
		    $scope.admcst.refresh();
		    break;
		}
	    },
	    button: $stateParams.id === "-1"
	};

	// the current customer
	this.current = {};

	// existing statuses in db
	this.statuses = [];
	Server.list.statuses()
	    .then(function(promised) {
		$scope.admcst.statuses = promised.data;
            });

	this.refresh = function() {
	    var id = $stateParams.id;
	    console.log(this.state, $stateParams.id);
	    if(this.state.current === 'reading') {
		Server.read.customer.info(id)
		    .then(function(promised) {
			// set general info
			$scope.admcst.current = Decode.customer(promised.data);
			// set status
			var status = $scope.admcst.statuses.filter(function(val, ind, arr) {
			    return val.id == $scope.admcst.current.statusId;
			});
			//initiate to the right status (that complicated 'cause ngOptions understand references instead of values)
			$scope.admcst.current.status = $scope.admcst.statuses[$scope.admcst.statuses.indexOf(status[0])];
			// get balance
			Server.read.customer.balance(id)
			    .then(function(promised){
				$scope.admcst.current.money = parseFloat(promised.data.balance);
			    });
		    });
	    }
	};
	// register this standard refresh function
        $rootScope.$on('refresh', function(e, a) {$scope.admcst.refresh();});

	$scope.openBottomSheet = function() {
	    $mdBottomSheet.show({
		template: '<md-bottom-sheet>Hello!</md-bottom-sheet>'
	    });
	};
	
        // show a bottom sheet
	this.botsheet = function() {
	    $mdBottomSheet.show({
		controller: 'AdmCustomerBotSheetCtrl',
		controllerAs: 'admcstbs',
		locals: {customer: $scope.admcst.current},
	        templateUrl: 'admin/cst/admcst-bottomsheet.tpl.html'        
	    });
	};

	// the cancel action, must restore the right state
	this.cancel = function() {
	    this.state.current = states.READING;
            this.state.button = false;
            $scope.admcst.refresh();
        };

	// the confirm action, depends on the state
        this.confirm = function() {
	    var customer = $scope.admcst.current;
            switch(this.state.current) {
	    case updating:
		// set the right statusId
		customer.statusId = $scope.admcst.filter(function(val, ind, arr) {
		    return val.name === customer.status;
		})[0].id;
		// post info
		Server.update.customer(customer);
		break;
	    case creating:
                // set the right statusId
                customer.statusId = $scope.admcst.filter(function(val, ind, arr) {
                    return val.name === customer.status;
                })[0].id;
                // post info
                Server.update.customer(customer);
		// post balance
		Server.create.deposit({
		    customer: customer,
		    amount: customer.money
		});
		break;
	    }
        };

	// bring it on
	this.refresh();
    }])

    .controller('AdmCustomerBotSheetCtrl', function($rootScope, $scope, $mdBottomSheet, $mdDialog, Server, Toast, customer) {

	var del = function() {
	    // confirm first
	    var confirm = $mdDialog.confirm()
                .title('Confirmation')
                .content("Do you really want to remove " + customer.name +"'s account ?")
                .ariaLabel('Customer removal confirmation')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
		//Server.logout();
		Server.guiAuthenticate()
		    .then(function() {
			// relogged in, do the removal
			Server.del.customer(customer.id)
			    .then(function() {
				// success
				new Toast().display("removal done");
				$mdBottomSheet.hide();
				$rootScope.$emit('refresh', {'from':'delete', 'to':'all'});
                            });
		    }, function() {
			new Toast().display("removal cancelled");
			$mdBottomSheet.cancel();
                    });
	    }, function() {
		new Toast().display("removal cancelled");
		$mdBottomSheet.cancel();
            });
        };

        this.opts = [
            {
                label: 'Delete',
		icon: 'times',
		action: del
	    }
	];
	
    });
