angular.module('babar.sell', [
    'babar.test'
])
    .filter('search', function(){
	return function(input, keyword){
	    return input.filter(function(val, ind, arr){
		    // test if keyword is included in the name or surname
		    return val.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
		});
	};
    })

    .filter('chrono', function(){
	return function(input){
	    //sort items chronogically
	    if(input){
		return input.sort(function(a, b){
		    var dateA = new Date(a.time);
		    var dateB = new Date(b.time);
		    return dateB.getTime() - dateA.getTime();
		});
	    }
	};
	
    })
	    
    .controller('SellCtrl', ['TestFct', function(TestFct){
	

	Current = function(hasDetails){
	    this.currentItem = null;
	    this.details = null;
	    this.change = function(newItem){
		this.currentItem = newItem;
		if(hasDetails){
		    this.details = TestFct.getInfo(newItem.id);
		}
	    };
	    this.getClass = function(anItem){
                if(anItem === this.currentItem){
                    return 'list-group-item active';
                }else{
                    return 'list-group-item';
                }
            };
	};
        
	// current client
	this.currentClient = new Current(true);
	this.clientKeyword = "";
	//current drink
	this.currentDrink = new Current(false);
	this.drinkKeyword = "";


	//load clients' list
	this.clients = TestFct.getClients();

	//load drinks' list
	this.drinks = TestFct.getDrinks();

	// takes the money value and returns an appropriate color
	this.getMoneyColor = function(){
	    if (this.currentClient.details === null){
		return '#EE999C'; //pink
	    }
	    else if(this.currentClient.details.money > 15){
		return '#15BF25'; //green
	    }
	    else if(this.currentClient.details.money > 10){
		return '#FFA005'; //yellow
	    }
	    else if(this.currentClient.details.money > 5){
		return '#FF5900'; //orange
            }
	    else {
		return '#E5251E'; //red
	    }
	};

	// convert a date to something readable
	this.toDateString = function(date){
	    var dateObj = new Date(date);
	    return dateObj.toDateString();
	};


	}]);






