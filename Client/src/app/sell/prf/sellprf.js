angular.module('babar.sell.prf', [
    'babar.sell'
])
    .directive('sellProfile', function() {
        return {
            templateUrl: 'sell/prf/sellprf.tpl.html',
	    controller: 'SellCtrl'
	};});
