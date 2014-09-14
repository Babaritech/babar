angular.module( 'babar', [
    'templates-app',
    'templates-common',
    'ui.router',
    'babar.sell'
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
		controller: "SellCtrl"
            })
            .state('admin', {
                url: "/admin",
                templateUrl: "admin/admin.tpl.html",
		controller: "AdminCtrl"
	    });
    }])

    .run( function run () {
    })

    .controller('AppCtrl', ['$scope', function($scope) {
    }]);
