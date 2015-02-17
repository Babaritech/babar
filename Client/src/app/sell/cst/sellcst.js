angular.module('babar.sell.cst', [
    'babar.sell',
    'babar.server',
    'ui.router'
])
    .directive('sellCustomer', function() {
	return {
	    templateUrl: 'sell/cst/sellcst.tpl.html',
	    controllerAs: 'sellcst',
            controller: function($scope, $state, searchFilter, selectFilter, Focus, Server, Encode, Decode) {

                //load customers' list
		this.list = [];
		Server.list.customers()
		    .then(function(res){
			$scope.sellcst.list = Decode.customers(res.data);
		    });

		// current customer
		this.current = {
		    keyword: "",
		    index: 0,
		    size: 0,
		    details: null,
		    getCurrentId : function(){
			return selectFilter(searchFilter($scope.sellcst.list, this.keyword), this.index)[this.index].id;
		    },
		    getTotalSpent: function(){
			Server.read.customer.totalEntries(this.details.id)
			    .then(function(res){
				$scope.sellcst.current.details.totalSpent = res.data.total;
			    });
		    },
		    getFavDrink: function(){
			var ret = null;
			var favourite;
			var times = {};
			orderBy(this.details.history, $scope.sell.chronological, true).forEach(function(val, ind, arr){
			    if(!times[val.name]){
				times[val.name] = 1;
			    }else{
				times[val.name] += 1;
			    }
			});
			var howMany = 0;
			for(var drink in times){
			    if(times[drink] > howMany){
				favourite = drink;
				howMany = times[drink];
			    }
			}
			if(howMany !== 0){
			    ret = favourite;
			}else{
			    ret = 'none';
			}
			this.details.favDrink = ret;
		    },
		    getActualMoney: function(){
			//change money indication for peculiar statuses
			if(this.details.status){
			    var money = this.details.money;
			    money -= parseInt(this.details.status.overdraft, 10);
			    return money;
			}else{
			    return 100;
			}
		    },
		    getBalance: function(){
			//get the amount money a customer has
			Server.read.customer.balance(this.getCurrentId())
			    .then(function(res){
				$scope.sellcst.current.details.money = res.data.balance;
			    });
		    },
		    getStatus: function(){
			//get the status from the statusId
			Server.read.status.info(this.details.statusId)
			    .then(function(res){
				$scope.sellcst.current.details.status = res.data;
			    });
		    },
		    getHistory: function(){
			//get the consumption history of the customer
			Server.read.customer.history(this.getCurrentId())
			    .then(function(res){
				$scope.sellcst.current.details.history = Decode.history(res.data);
				//once the history is retrieve, we can get some extra info
				$scope.sellcst.current.getFavDrink();
				$scope.sellcst.current.getTotalSpent();
			    });
		    },
		    refresh: function(){
			//get the customer's basic info
			Server.read.customer.info(this.getCurrentId())
			    .then(function(res){
				//gotta interpret the customer status (rank)
				$scope.sellcst.current.details = res.data;

				//get the customer's further info
				$scope.sellcst.current.getStatus();
				$scope.sellcst.current.getBalance();
				$scope.sellcst.current.getHistory();
			    });

			//updata the size of the list
			this.size = selectFilter(
			    searchFilter(
				$scope.sellcst.list,
				this.keyword),
			    this.index).length;
		    },
		    up: function(){
			if(this.index > 0){
			    this.index -= 1;
			    this.refresh();
			}
		    },
		    down: function(){
			if(this.index < this.size - 1){
			    this.index +=1;
			    this.refresh();
			}
		    },
		    setIndex: function(index, isAMouseAttempt){
			this.index = index;
			if(isAMouseAttempt){
			    this.refresh();
			    Focus.setLocation('customer');
			}
		    },
		    blockIndex: function(){
			$scope.sellcst.current.setIndex(0, false);
		    }
		};

		//setting up watches so the highlighted item will always be zero during a search
                $scope.$watch(this.current.keyword, this.current.blockIndex);
		
	    }};});
