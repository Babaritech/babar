angular.module('babar.admin', [
    'babar.server',
    'ui.router'
])

    .controller('AdminCtrl', ['$scope', '$state', 'Server', function($scope, $state, Server){

	//TODO: do a server call to ensure that one has the right to be here

	this.debug = function(){
	    console.log('debug');
	    $state.go('admin.customer');
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
	    //change the url and desactive current item
	    $state.go('admin');
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
	    $state.go('admin.'+this.currentDomain, {'id': item.id});
        };
	
	this.detailsBoilerplates = {
	    drink: {
		name: {
		    string: 'Name',
		    type: 'text',
		    data: null
		},
		degree: {
		    string: 'Percentage of alcohol',
		    type: 'number',
		    data: null
		},
		volume: {
		    string: 'Volume (in cL)',
		    type: 'number',
		    data: null
		},
		price: {
		    string: 'Price (in €)',
		    type: 'number',
		    data: null
		}
	    }
	};
	    
    }]);
