angular.module('babar.admin.drink', [
    'babar.server'
])
    .controller('AdmDrinkCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$mdBottomSheet', 'Server', 'Encode', 'Decode', 'Toast', function($rootScope, $scope, $state, $stateParams, $mdBottomSheet, Server, Encode, Decode, Toast){
	
	// FSM for the current drink
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
                    $scope.admdrk.refresh();
                    break;
                }
            },
            button: $stateParams.id === "-1"
        };

        // the current drink
        this.current = {};

        this.refresh = function() {
            var id = $stateParams.id;
            if(this.state.current === 'reading') {
                Server.read.drink.info(id)
                    .then(function(promised) {
                        // set general info
                        $scope.admdrk.current = Decode.drink(promised.data);
                    });
            }
        };
        // register this standard refresh function
        $rootScope.$on('refresh', function(e, a) {
	    if(a.to === 'all') {
		$scope.admdrk.refresh();
	    }
	});

        
        // show a bottom sheet
        this.botsheet = function() {
            $mdBottomSheet.show({
                controller: 'AdmDrinkBotSheetCtrl',
                controllerAs: 'admdrkbs',
                locals: {drink: $scope.admdrk.current},
                templateUrl: 'admin/drk/admdrk-bottomsheet.tpl.html'        
            });
        };

        // the cancel action, must restore the right state
        this.cancel = function(message) {
            $scope.admdrk.state.current = states.READING;
            $scope.admdrk.state.button = false;
            if(message) {
                new Toast().display(message);
            }
            else {
                new Toast().display('cancelled');
            }
	    $rootScope.$emit('refresh', {'from':'admdrk', 'to':'admin'});
        };

        // the confirm action, depends on the state
        this.confirm = function() {
            var drink = $scope.admdrk.current;
            switch(this.state.current) {
            case 'updating':
                // post info
                Server.update.drink(drink)
                    .then(function() {
                        $scope.admdrk.cancel('drink updated');
                    });
                break;
            case 'creating':
                // add a fake id
                drink.id = -1;
                // post info
                Server.create.drink(drink)
                    .then(function(promised) {
			// retrieve the new drink's id
                        drink.id = promised.data.id;
			$state.go('admin.drinks', {id: drink.id});
                        $scope.admdrk.cancel('drink created');
                    });
                break;
            }
        };

        // bring it on
        this.refresh();
    }])

    .controller('AdmDrinkBotSheetCtrl', function($rootScope, $scope, $mdBottomSheet, $mdDialog, Server, Toast, drink) {

        var del = function() {
            // confirm first
            var confirm = $mdDialog.confirm()
                .title('Confirmation')
                .content("Do you really want to remove the " + drink.name +" ?")
                .ariaLabel('Drink removal confirmation')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                Server.logout();
                Server.del.drink(drink.id)
                    .then(function() {
                        // success
                        new Toast().display("removal done");
                        $mdBottomSheet.hide();
			$scope.admdrk.current = null;
			$state.go('admin');
                        $rootScope.$emit('refresh', {'from':'delete', 'to':'all'});
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
