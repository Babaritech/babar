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
	document.getElementById('drinkInput').focus();
	this.debug = function(){
	    console.log('debug');
	};

	// current customer
	this.customer = {
	    keyword: "",
	    current: null,
	    details: null,
	    getClass: function(aCustomer){
                if(aCustomer === this.current){
                    return 'list-group-item active';
                }else{
                    return 'list-group-item';
                }
            },
	    set: function(newCustomer){
		this.current = newCustomer;
		this.details = TestFct.getInfo(newCustomer.id);
	    },
	    buy: function(currentDrink){
		currentDrink.isToConfirm = false;
		//DIALOG
		console.log('bought');
	    }
	};
	
	//current drink
	this.drink = {
            keyword: "",
            current: null,
            getClass: function(aDrink){
                if(aDrink === this.current){
                    return 'list-group-item active';
                }else{
                    return 'list-group-item';
                }
            },
            set: function(newDrink){
                this.current = newDrink;
		this.isToConfirm = true;
            },
	    isToConfirm: false,
	    cancel: function(){
		this.current = null;
		this.isToConfirm = false;
	    }
        };


	//load customers' list
	this.customers = TestFct.getCustomers();

	//load drinks' list
	this.drinks = TestFct.getDrinks();

	// takes the money value and returns an appropriate color
	this.getMoneyColor = function(){
	    if (this.customer.details === null){
		return '#EE999C'; //pink
	    }
	    else if(this.customer.details.money > 15){
		return '#15BF25'; //green
	    }
	    else if(this.customer.details.money > 10){
		return '#FFA005'; //yellow
	    }
	    else if(this.customer.details.money > 5){
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
