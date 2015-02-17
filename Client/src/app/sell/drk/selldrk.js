angular.module('babar.sell.drk', [
    'babar.sell',
    'babar.server',
    'ui.router'
])
    .directive('sellDrink', function() {
        return {
            templateUrl: 'sell/drk/selldrk.tpl.html',
            controllerAs: 'selldrk',
            controller: function($scope, $state, searchFilter, selectFilter, Focus, Server, Encode, Decode) {

		var refresh = function() {
                    this.current.refresh();
                };
                $scope.$on('refresh', function(e, a) {refresh();});

                //load drinks' list
		this.list = [];
		Server.list.drinks()
		    .then(function(res){
			$scope.selldrk.list = Decode.drinks(res.data);
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
				$scope.selldrk.list,
				this.keyword),
			    this.index)
			[this.index];
			this.size = selectFilter(
			    searchFilter(
				$scope.selldrk.list,
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
			$scope.selldrk.current.setIndex(0, false);
		    }
		};
		
                //setting up watches so the highlighted item will always be zero during a search
                $scope.$watch(this.current.keyword, this.current.blockIndex);
		
	    }};});
