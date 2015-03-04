angular
    .module('babar.deposit', [
	'babar.error',
	'babar.server',
	'ngMaterial',
	'cfp.hotkeys'
])
    .controller('DepositCtrl', function($rootScope, $scope, $mdDialog, Server, Toast, hotkeys, customer, user){
	
	this.customer = customer.details;
	this.user = {id: 1}; // FIXME
	this.money = 0;

	this.error = "";
        this.cancel = function() {
            new Toast().display('deposit cancelled');
            $mdDialog.cancel();
        };
	
	this.confirm = function(){
	    if($scope.dep.money === 0){
		$scope.dep.error = "Can't deposit no money.";
	    }else if($scope.dep.money > 100){
		$scope.dep.error = "Can't deposit more than 100€ at a time.";
	    }else{
		Server.create.deposit({
		    customer: $scope.dep.customer,
		    amount: $scope.dep.money,
		    user: $scope.dep.user
		}).then(function() {
		    $rootScope.$emit('refresh', {'from': 'deposit', 'to': 'all'});
		    $mdDialog.hide();
                });
	    }
        };

	$scope.confirm = this.confirm;
	hotkeys.add({
            combo: 'enter',
            description: 'Authenticate the sale',
            callback: $scope.confirm,
            allowIn: ['INPUT']
        });
    });
