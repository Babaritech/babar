angular.module('babar.confirm', [
    'babar.server',
    'cfp.hotkeys'
])
    .controller('ConfirmCtrl', ['$scope', 'Server', 'hotkeys', function($scope, Server, Hotkeys){
	this.customer = $scope.ngDialogData[0];
	this.drink = $scope.ngDialogData[1];
	
	//Let's set up some hotkeys !
	$scope.buy = function(){
	    var date = new Date();
	    Server.buy(this.customer, this.drink, date.getTime());
            $scope.closeThisDialog('bought');
        };
	$scope.cancel = function(){
            $scope.closeThisDialog('cancelled');
        };
        
        Hotkeys.add({
                combo: 'enter',
                description: 'Confirm',
                callback: $scope.buy
        });
	Hotkeys.add({
                combo: 'escape',
                description: 'Cancel',
                callback: $scope.cancel
	});
        
    }]);
