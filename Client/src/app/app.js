angular.module( 'babar', [
    'templates-app',
    'templates-common',
    'ui.router',
    'babar.sell',
    'babar.admin'
])

    .config( ['$stateProvider', '$urlRouterProvider',  function myAppConfig ( $stateProvider, $urlRouterProvider ) {
	//
        // For any unmatched url, redirect to /sell
        $urlRouterProvider.otherwise("/sell");
        //
        // Now set up the states
        $stateProvider
            .state('sell', {
                url: "/sell",
                templateUrl: "sell/sell.tpl.html",
		controller: "SellCtrl",
		controllerAs: "sell"
            })
            .state('admin', {
                url: "/admin",
                templateUrl: "admin/admin.tpl.html",
		controller: "AdminCtrl",
		controllerAs: "admin"
	    });
    }])

    .run( function run () {
    })

    .controller('AppCtrl', ['$scope', function($scope) {
    }]);
