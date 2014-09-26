angular.module( 'babar', [
    'templates-app',
    'templates-common',
    'ui.router',
    'ui.bootstrap',
    'babar.sell',
    'babar.admin'
])

    .config( ['$stateProvider', '$urlRouterProvider',  function myAppConfig ( $stateProvider, $urlRouterProvider ) {
	//
        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('sell', {
                url: "/",
                templateUrl: "sell/sell.tpl.html",
		controller: "SellCtrl",
		controllerAs: "sell"
            })
            .state('admin', {
                url: "/admin",
                templateUrl: "admin/admin.tpl.html",
		controller: "AdminCtrl",
		controllerAs: "admin"
	    })
	    .state('admin.customer', {
		url: "/customer",
		templateUrl: "admin/partials/test.tpl.html",
		controller: "AdmCustomerCtrl",
		controllerAs: "admcst"
	    })
            .state('admin.drink', {
                url: "/drink/:itemId/",
                templateUrl: "admin/partials/drink.tpl.html",
                controller: "AdmDrinkCtrl",
                controllerAs: "admdrk"
            })
            .state('admin.user', {
                url: "/user/:itemId",
                templateUrl: "admin/partials/user.tpl.html",
                controller: "AdmUserCtrl",
                controllerAs: "admusr"
            })
            .state('admin.stat', {
                url: "/stat/:itemId",
                templateUrl: "admin/partials/stat.tpl.html",
                controller: "AdmStatCtrl",
                controllerAs: "admstt"
            });       
    }])

    .run( function run () {
    })

    .controller('AppCtrl', ['$scope', function($scope) {
    }]);
