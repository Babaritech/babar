angular.module('babar.sell', [
    'cfp.hotkeys',
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

    .filter('select', function(){
	return function(input, index){
	    return input.map(function(val, ind, arr){
		if(ind === index){
		    val.active = true;
		}else{
		    val.active = false;
		}
		return val;
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

    .factory('Focus', [function(){
	//This aim to make the navigation easier by setting up keyborad shortcuts
	//There are three fields of interest: customer input, drink input, sell confirmation, and neither of these
	Focus = function(){

	    //keeps tracks on focus' location
	    var location = {
		out: 0, //focus is lost
		customer: 1,
		drink: 2,
		confirmation: 3,
		current: 0 //where we are now
	    };

	    this.forward = function(){
		var isWaitingForConfirm;
		switch(location.current){
		case 1:
                    document.getElementById('drinkInput').focus();
                    location.current = location.drink;
		    isWaitingForConfirm = false;
		    break;
		case 2:
                    document.getElementById('confirmationInput').focus();
                    location.current = location.confirmation;
		    isWaitingForConfirm = true;
		    break;
		default :
                    document.getElementById('customerInput').focus();
                    location.current = location.customer;
                    isWaitingForConfirm = false;
		    console.log('customer');
                    break;
		}
		return isWaitingForConfirm;
	    };

	    this.backward = function(){
		var isWaitingForConfirm = false;
                switch(location.current){
                case 2:
                    document.getElementById('customerInput').focus();
                    location.current = location.customer;
                    break;
                case 3:
                    document.getElementById('drinkInput').focus();
                    location.current = location.drink;
                    break;
                default :
                    document.getElementById('customerInput').focus();
                    location.current = location.customer;
                    break;
                }
                return isWaitingForConfirm;
            };
	    
	};

	return new Focus();
    }])
	    
    .controller('SellCtrl', ['$scope', 'TestFct', 'Focus', 'searchFilter', 'selectFilter', 'hotkeys', function($scope, TestFct, Focus, searchFilter, selectFilter, Hotkeys){

	this.debug = function(arg){
	    console.log(arg);
	};
	
	//load customers' list
	this.customers = TestFct.getCustomers();
        //load drinks' list
        this.drinks = TestFct.getDrinks();

        
	// current customer
	this.customer = {
	    keyword: "",
	    index: -1,
	    details: null,
	    refresh: function(){
		this.details = TestFct.getInfo(
		    selectFilter(
		    searchFilter(
			$scope.sell.customers,
			this.keyword),
			this.index)
		    [this.index].id);
            },
	    up: function(){
		this.index += 1;
		this.refresh();
	    },
	    down: function(){
		this.index -=1;
		this.refresh();
	    },
	    setIndex: function(index){
		this.index = index;
		this.refresh();
            }	
	};

	//current drink
	this.drink = {
            keyword: "",
	    index: -1,
	    details: null,
	    isToConfirm: false,
	    refresh: function(){
                this.details = selectFilter(
                    searchFilter(
                        $scope.sell.drinks,
                        this.keyword),
                    this.index)
                [this.index];
            },
            up: function(){
                this.index += 1;
		this.refresh();
            },
            down: function(){
                this.index -=1;
		this.refresh();
            },
            setIndex: function(index){
                this.index = index;
		this.refresh();
	    },
	    buy: function(customer){
		//DIALOG
		this.details = null;
	    },
	    cancel: function(){
		this.details = null;
	    }
        };


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


	//This sets up some hotkeys !
	Hotkeys.bindTo($scope)
	    .add({
		combo: 'enter',
		description: 'Confirm, or move to the next field',
		callback: hotkConfirm
	    })
	    .add({
		combo: 'escape',
		description: 'Cancel, or move to the previous field',
		callback: hotkCancel
	    });

	var hotkConfirm = function(){
	    
	};

	var hotkCancel= function(){
	};

	
    }]);
