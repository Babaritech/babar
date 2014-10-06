angular.module('babar.confirm', [
    'babar.server',
    'cfp.hotkeys'
])
    .controller('ConfirmCtrl', ['$scope', 'Server', 'hotkeys', function($scope, Server, Hotkeys){
	this.customer = $scope.ngDialogData[0];
	this.drink = $scope.ngDialogData[1];
	var actualMoney = $scope.ngDialogData[2];
	
	$scope.buy = function(){
	    console.log('buy');
	    if(actualMoney>0){
		console.log('confirm');
		Server.perform('buy', {customer: $scope.confirm.customer, drink: $scope.confirm.drink});
		$scope.closeThisDialog('bought');
            }else{
		$scope.closeThisDialog('forbidden');
            }
        };
	$scope.cancel = function(){
            $scope.closeThisDialog('cancelled');
        };


	//Let's set up some hotkeys !
        Hotkeys.add({
                combo: 'enter',
                description: 'Confirm the sale',
                callback: $scope.buy
        });
	Hotkeys.add({
                combo: 'escape',
                description: 'Cancel the sale',
                callback: $scope.cancel
	});
        
    }]);
