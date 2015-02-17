angular.module('babar.sell.drk', [
    'babar.sell',
    'babar.server'
])
    .directive('sellDrink', function() {
        return {
            templateUrl: 'sell/drk/selldrk.tpl.html',
            controllerAs: 'selldrk',
            controller: function($scope, Server, Encode, Decode) {

		//load drinks' list
		this.list = [];
		Server.list.drinks()
		    .then(function(res){
			$scope.sell.drinks = Decode.drinks(res.data);
		    });
		
		//current drink
		this.current = {
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
		
	    }};});
