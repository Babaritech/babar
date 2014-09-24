angular.module('babar.deposit', [
    'babar.server',
    'cfp.hotkeys'
])
    .controller('DepositCtrl', ['$scope', 'Server', 'hotkeys', function($scope, Server, Hotkeys){
	
	
        this.customer = $scope.ngDialogData[0];

	this.money = 0;

	this.error = "";
	
	$scope.make = function(){
	    if($scope.deposit.money === 0){
		$scope.deposit.error = "Can't deposit no money.";
	    }else if($scope.deposit.money > 100){
		$scope.deposit.error = "Can't deposit more than 100€ at a time.";
	    }else{
		$scope.closeThisDialog($scope.deposit.money); //deposited
	    }
        };
	$scope.cancel = function(){
            $scope.closeThisDialog(0); //cancelled
        };

	$scope.selectField = function(){
	    document.getElementById('depositInput').focus();
        };

        //Let's set up some hotkeys !
	Hotkeys.add({
            combo: 'enter',
            description: 'Make the deposit',
            callback: $scope.make,
	    allowIn: ['INPUT']
        });
        Hotkeys.add({
            combo: 'escape',
            description: 'Cancel the deposit',
            callback: $scope.cancel,
	    allowIn: ['INPUT']
        });
        Hotkeys.add({
	    combo: 'tab',
	    description: 'Select the right field',
	    callback: $scope.selectField,
	    allowIn: ['INPUT']
	});
    }]);
