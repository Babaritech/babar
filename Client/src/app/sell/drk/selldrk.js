angular.module('babar.sell.drink', [
    'babar.server'
])
    .controller('SellDrinkCtrl', ['Server', function(Server) {

	 //load drinks' list
        this.drinks = [];
        Server.get('drink')
            .then(function(res){
                $scope.sell.drinks = Decode.drinks(res.data);
            });

        //current drink
        this.drink = {
            keyword: "",
            index: 0,
            size: 0,
            details: null,
            isToConfirm: false,
            refresh: function(){
                this.details = selectFilter(
                    searchFilter(
                        $scope.sell.drinks,
                        this.keyword),
                    this.index)
                [this.index];
                this.size = selectFilter(
                    searchFilter(
                        $scope.sell.drinks,
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
                    $scope.sell.mouseAttempt();
                }
            },
            blockIndex: function(){
                $scope.sell.drink.setIndex(0, false);
            }
        };

	
    }]);
