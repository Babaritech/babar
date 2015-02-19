angular.module( 'babar', [
    'templates-app',
    'templates-common',
    'ui.router',
    'ui.bootstrap',
    'unicorn-directive',
    'babar.sell',
    'babar.admin',
    'babar.admin.customer',
    'babar.admin.user',
    'babar.admin.drink',
    'babar.admin.stat'
    
])

    .config( ['$stateProvider', '$urlRouterProvider',  function myAppConfig ( $stateProvider, $urlRouterProvider ) {
	
        // TODO: For any unmatched url, redirect to a 404 error
        $urlRouterProvider.otherwise("/");
        
        // Now set up the states
        $stateProvider
            .state('sell', {
                url: "/",
                templateUrl: "sell/sell.tpl.html",
		controller: "SellCtrl",
		controllerAs: "sell"
	    })
	    .state('error', {
		url: "/error/:status",
		templateUrl: "error/error.tpl.html",
		controller: "ErrorCtrl",
		controllerAs: "error"
	    })
            .state('admin', {
                url: "/admin",
                templateUrl: "admin/admin.tpl.html",
		controller: "AdminCtrl",
		controllerAs: "admin"
	    })
	    .state('admin.customer', {
		url: "/customer/:id",
		templateUrl: "admin/cst/customer.tpl.html",
		controller: "AdmCustomerCtrl",
		controllerAs: "admcst"
	    })
            .state('admin.drink', {
                url: "/drink/:id/",
                templateUrl: "admin/drk/drink.tpl.html",
                controller: "AdmDrinkCtrl",
                controllerAs: "admdrk"
            })
            .state('admin.user', {
                url: "/user/:id",
                templateUrl: "admin/usr/user.tpl.html",
                controller: "AdmUserCtrl",
                controllerAs: "admusr"
            });
    }])

    .run( function run () {
    })

    .controller('AppCtrl', ['$scope', function($scope) {
    }]);
