angular.module('babar.deposit', [
    'babar.server',
    'cfp.hotkeys'
])
    .controller('DepositCtrl', ['$scope', 'Server', 'React', 'hotkeys', function($scope, Server, React, Hotkeys){
	
	
        this.customer = $scope.ngDialogData[0];

	this.money = 0;

	this.error = "";
	
	$scope.make = function(){
	    if($scope.deposit.money === 0){
		$scope.deposit.error = "Can't deposit no money.";
	    }else if($scope.deposit.money > 100){
		$scope.deposit.error = "Can't deposit more than 100€ at a time.";
	    }else{
		$scope.deposit.disableHotkeys();
		var func = 'perform';
		var args = {
                    action: 'deposit',
                    data: {customer: $scope.deposit.customer, amount: $scope.deposit.money}
                };
		var promise = Server.perform(args);
		console.log(promise);
		React.toPromise(promise, func, args, function() {
		    $scope.closeThisDialog('deposited');                
                });                
	    }
        };
	$scope.cancel = function(){
	    $scope.deposit.disableHotkeys();
            $scope.closeThisDialog('cancelled');
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
	this.disableHotkeys = function(){
            Hotkeys.del('tab');
            Hotkeys.del('enter');
            Hotkeys.del('escape');
        };
    }]);
