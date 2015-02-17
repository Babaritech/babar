angular.module('babar.sell', [
    'babar.server'
])
    .directive('sellCustomer', function() {
	return {
	    template: 'sell/cst/sellcst.tpl.html',
	    controller: SellCstCtrl,
	    controllerAs: sellcst
	};
    });


SellCustomerCtrl = function() {
    
    //load customers' list
    this.customers = [];
    Server.get('customer')
        .then(function(res){
            $scope.sell.customers = Decode.customers(res.data);
        });

    // current customer
    this.customer = {
        keyword: "",
        index: 0,
        size: 0,
        details: null,
        getCurrentId : function(){
            return selectFilter(searchFilter($scope.sell.customers, this.keyword), this.index)[this.index].id;
        },
        getTotalSpent: function(){
            Server.get('customer', this.details.id, 'total_entries')
                .then(function(res){
                    $scope.sell.customer.details.totalSpent = res.data.total;
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
            Server.get('customer', this.getCurrentId(), 'balance')
                .then(function(res){
                    $scope.sell.customer.details.money = res.data.balance;
                });
        },
        getStatus: function(){
            //get the status from the statusId
            Server.get('status', this.details.statusId)
                .then(function(res){
                    $scope.sell.customer.details.status = res.data;
                });
        },
        getHistory: function(){
            //get the consumption history of the customer
            Server.get('sell', this.getCurrentId(), 'customer_history')
                .then(function(res){
                    $scope.sell.customer.details.history = Decode.history(res.data);
                    //once the history is retrieve, we can get some extra info
                    $scope.sell.customer.getFavDrink();
                    $scope.sell.customer.getTotalSpent();
                });
        },
        refresh: function(){
            //get the customer's basic info
            Server.get('customer', this.getCurrentId())
                .then(function(res){
                    //gotta interpret the customer status (rank)
                    $scope.sell.customer.details = res.data;
                    
                    //get the customer's further info
                    $scope.sell.customer.getStatus();
                    $scope.sell.customer.getBalance();
                    $scope.sell.customer.getHistory();
                });

            //updata the size of the list
            this.size = selectFilter(
                searchFilter(
                    $scope.sell.customers,
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
            $scope.sell.customer.setIndex(0, false);
        }
    };


};
