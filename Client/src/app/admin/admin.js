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
	    Server.perform({
		action:'logout'
	    });
	};
        this.getAdminItems = function(domain){
	    var promise;
            switch(domain){
            case 'customer':
                Server.get('customer')
                    .then(function(res) { //success
                        //add an useful 'name' attribute
			$scope.admin.items = res.data.map(function(val, ind, arr){
                            val.name = val.firstname + " ("+ val.nickname + ") " + val.lastname;
                            return val;
                        });
			
			// At start, highlight first item
                        $scope.admin.changeItem($scope.admin.items[0]);
			
                    }, function(res) { //failure
			$state.go('error', {'status':res.status});
		    });
		break;
            case 'drink':
		Server.get('drink')
                    .then(function(res){ //success
                        $scope.admin.items = res.data;
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
