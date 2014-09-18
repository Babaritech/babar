angular.module('babar.confirm', [])
    .controller('ConfirmCtrl', ['$scope', 'Server', function($scope, Server){
	this.customer = $scope.ngDialogData[0];
	this.drink = $scope.ngDialogData[1];
	this.buy = function(){
	    console.log('bought');
	};
	this.cancel = function(){
	};
	console.log($scope);
    }]);
