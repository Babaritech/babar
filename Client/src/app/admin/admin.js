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
		faIcon: "male"
	    },
	    {
		name: "users",
                title: "Users",
                description: "See who's in charge.",
		faIcon: "users"
            },
            {
		name: "drinks",
                title: "Drinks",
                description: "Consult, modify or add drinks.",
		faIcon: "beer"
            }
	    ],
	    current: null,
	    change: function(domain) {
                this.current = domain.name;
            }
	};

	this.item = {
	    list: [],
	    current: null,
	    change: function(item) {
		this.current = item.name;
		// refresh
	    }
	};
	
	this.signOut = function(){
	    Server.logout();
	};

	this.refresh = function(domain) {
	    Server.list[domain.name]
		.then(function(promised) {
		    $scope.admin.item.list = Decode[domain.name](promised.data);
		    $scope.admin.item.current = $scope.admin.item.list[0];
		});
	};
	// register this standard refresh function
	$rootScope.$on('refresh', function(e, a) {$scope.admin.refresh();});
    }]);
