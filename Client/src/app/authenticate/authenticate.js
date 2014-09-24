angular.module('babar.authenticate', [
    'babar.server',
    'cfp.hotkeys'
])
    .controller('AuthenticateCtrl', ['$scope', 'Server', 'hotkeys', function($scope, Server, Hotkeys){
	
	this.customer = $scope.ngDialogData[0];
	this.action = $scope.ngDialogData[1];
	this.data = $scope.ngDialogData[2];
	
	
	$scope.buy = function(){
	    var date = new Date();
	    Server.buy(this.customer, this.drink, date.getTime());
            $scope.closeThisDialog('bought');
        };
	$scope.cancel = function(){
            $scope.closeThisDialog('cancelled');
        };


	//Let's set up some hotkeys !
        Hotkeys.add({
            combo: 'enter',
            description: 'Authenticate the sale',
            callback: $scope.buy
        });
	Hotkeys.add({
            combo: 'escape',
            description: 'Cancel the sale',
            callback: $scope.cancel
	});
        
    }]);
