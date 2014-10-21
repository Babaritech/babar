angular.module('babar.admin', [
    'babar.server',
    'ui.router'
])

    .controller('AdminCtrl', ['$scope', '$state', 'Server', function($scope, $state, Server){

	//Re-enable tab key, 'cause 'twill be useful in forms
	document.onkeydown = function (e) {
            if(e.which == 9){
                return true;
            }
        };
	
	this.domains = [
	    {
		name: "customer",
		title: "Customers",
		description: "Consult, modify or add customers."
	    },
	    {
		name: "user",
                title: "Users",
                description: "See who's in charge."
            },
            {
		name: "drink",
                title: "Drinks",
                description: "Consult, modify or add drinks."
            },
            {
		name: "stat",
                title: "Statistics",
                description: "Get familiar with some outstanding numbers."
            }
	];
	this.currentDomain = null;
	this.isActiveDomain = function(domain){
	    if(domain.name === this.currentDomain){
		return 'active';
	    }else{
		return '';
	    }
	};
	this.changeDomain = function(domain){
	    //desactivate current item
	    this.currentItem = null;
	    
	    this.currentDomain = domain.name;
	    var response = Server.getAdminItems(domain.name);
	    if(response.status !== 200){
		//TODO ('cause a bit extreme)
                $state.go('sell');
            }else{
		response.data.then(function(result){
		    $scope.admin.items = result;
		});
	    }
	};
	
        this.items = null;
	
        this.currentItem = null;
        this.isActiveItem = function(item){
            if(item.name === this.currentItem){
                return 'active';
            }else{
                return '';
            }
        };
        this.changeItem = function(item){
	    this.currentItem = item.name;
        };

	this.signOut = function(){
	    Server.signOut();
	};
	    
    }]);
