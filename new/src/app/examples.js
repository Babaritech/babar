angular.module('babar.test', [])
    .factory('TestFct', [function(){
	Test = function(){

	    this.getCustomers = function(){
		return customersData.map(function(val, ind, arr){
		    return {
			id: val.id,
			name: val.firstname + ' (' + val.nickname + ') ' + val.lastname
		    };
		});
	    };

	    this.getInfo = function(id){
		return customersData.reduce(function(acc, val, ind, arr){
		    if(id == val.id){
			return val;
		    }
		    else{
			return acc;
		    }
		}, null);
	    };

	    this.getDrinks = function(){
		return drinksData;
            };

	};

	return new Test();
    }]);
