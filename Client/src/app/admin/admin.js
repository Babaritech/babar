angular.module('babar.admin', [
    'babar.server',
    'ui.router'
])

    .controller('AdminCtrl', ['$rootScope', '$scope', '$state', 'Server', 'Decode', function($rootScope, $scope, $state, Server, Decode){

	//Re-enable tab key, 'cause 'twill be useful in forms
	document.onkeydown = function (e) {
            if(e.which == 9){
                return true;
            }
        };

	this.domain = {
	    list: [
	    {
		name: "customers",
		title: "Customers",
		description: "Consult, modify or add customers.",
		faIcon: "male",
		controllerAs: "admcst"
            },
	    {
		name: "users",
                title: "Users",
                description: "See who's in charge.",
		faIcon: "users",
		controllerAs: "admusr"
            },
            {
		name: "drinks",
                title: "Drinks",
                description: "Consult, modify or add drinks.",
		faIcon: "beer",
		controllerAs: "admdrk"
            }
	    ],
	    current: null,
	    change: function(domain) {
                this.current = domain;
		$scope.admin.refresh();
            }
	};

	this.item = {
	    list: [],
	    current: null,
	    change: function(item) {
		this.current = item;
		$state.go('admin.'+$scope.admin.domain.current.name, {id:item.id});
	    }
	};
	
	this.signOut = function(){
	    Server.logout();
	};

	this.refresh = function() {
	    var domain = this.domain.current.name;
	    Server.list[domain]()
		.then(function(promised) {
		    $scope.admin.item.list = Decode[domain](promised.data);
		});
	};
	// register this standard refresh function
	$rootScope.$on('refresh', function(e, a) {$scope.admin.refresh();});

	// bring it on
	this.domain.current = this.domain.list[0];
	this.refresh();
    }]);
