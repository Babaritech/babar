angular.module('babar.admin', [
    'babar.server',
    'ui.router'
])

    .controller('AdminCtrl', ['$scope', '$state', 'Server', 'Decode', function($scope, $state, Server, Decode){

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
		description: "Consult, modify or add customers.",
		faIcon: "male"
	    },
	    {
		name: "user",
                title: "Users",
                description: "See who's in charge.",
		faIcon: "users"
            },
            {
		name: "drink",
                title: "Drinks",
                description: "Consult, modify or add drinks.",
		faIcon: "beer"
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
	    this.getAdminItems(domain.name);
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


	//Dialog functions
	
	this.signOut = function(){
	    Server.logout();
	};
        this.getAdminItems = function(domain){
	    var promise;
            switch(domain){
            case 'customer':
                Server.list.customers()
                    .then(function(res) { //success
			//add an useful 'name' attribute
                        $scope.admin.items = Decode.customers(res.data);
			
			// At start, highlight first item
                        $scope.admin.changeItem($scope.admin.items[0]);
			
                    }, function(res) { //failure
			$state.go('error', {'status':res.status});
		    });
		break;
            case 'drink':
		Server.list.drinks()
                    .then(function(res){ //success
			//add an useful 'name' attribute
                        $scope.admin.items = Decode.drinks(res.data);

			// At start, highlight first item
                        $scope.admin.changeItem($scope.admin.items[0]);
                        
                    }, function(res) { //failure
                        $state.go('error', {'status':res.status});
                    });
		break;
            case 'user':
		$scope.admin.items = null; //waiting for server's implementation
		break;
            case 'stat':
		$scope.admin.items = null; //waiting for server's implementation
                break;
            default:
		$state.go('error', {'status':405});
		break;
            }
        }; 
        this.getAdminDetails = function(domain, id){
            switch(domain){
            case 'customer':
                return {status: 200, data: this.getCustomerInfo(id)};
            case 'drink':
                return {status: 200, data: this.getDrinkInfo(id)};
            case 'user':
                return {status: 200, data: this.getUserInfo(id)};
            case 'stat':
                return {status: 200, data: this.getStatInfo(id)};
            default:
                return {status: 400};
            }
        };
 
    }]);
