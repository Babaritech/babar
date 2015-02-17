angular.module('babar.sell', [
    'babar.sell.cst',
    'babar.sell.drk',
    'babar.server',
    'babar.confirm',
    'babar.deposit',
    'babar.easter',
    'ngDialog',
    'cfp.hotkeys',
    'ui.router'
])
    .filter('search', function(){
	return function(input, keyword){
	    return input.filter(function(ival, ind, arr){
		// test if keyword is included in the name
		//return val.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;

		//test if all the letters of the keyword are included in the name
		//choose the above if this is too slow
		return keyword.split('').every(function(kval, ind, arr){
		    return ival.name.toLowerCase().indexOf(kval.toLowerCase()) > -1;
		});
	    });
	};
    })

    .filter('select', function(){
	//update each item 'active' value for item highlighting
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

    .factory('Focus', [function(){
	//This aim to make the navigation easier by setting up keyboard shortcuts
	//There are three fields of interest: customer input, drink input, sell confirmation, and neither of these
	Focus = function(){

	    //keeps tracks on focus's location
	    var location = {
		out: 0, //focus is lost
		customer: 1,
		drink: 2,
		confirmation: 3,
		current: 0 //where we are now
	    };

	    this.getLocation = function(){
		switch(location.current){
		case 1:
		    return 'customer';
		case 2:
		    return 'drink';
		case 3:
		    return 'confirmation';
		default:
		    return 'null';
		}
	    };

	    this.setLocation = function(newLocation){
		location.current = location[newLocation];
		if(newLocation === 'customer'){
                    document.getElementById('customerInput').focus();
                }else if(newLocation === 'drink'){
		    document.getElementById('drinkInput').focus();
                } 
                return newLocation === 'confirmation'; //isWaitingForConfirm
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
                    document.getElementById('drinkInput').blur();
                    location.current = location.confirmation;
		    isWaitingForConfirm = true;
		    break;
		case 3:
                    document.getElementById('drinkInput').focus();
                    location.current = location.drink;
                    isWaitingForConfirm = false;
                    break;
	        default :
		    document.getElementById('customerInput').focus();
                    location.current = location.customer;
                    isWaitingForConfirm = false;
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

	    this.lose = function(){
		var location = this.getLocation();
		if(location === 'customer' || location === 'drink'){
		    document.getElementById(location+'Input').blur();
		}
	    };
            
        };

        return new Focus();
    }])

    .controller('SellCtrl', ['$rootScope', '$scope', '$state', '$filter', 'Server', 'Decode', 'Focus', 'Konami', 'searchFilter', 'selectFilter', 'hotkeys', 'ngDialog', function($rootScope, $scope, $state, $filter, Server, Decode, Focus, Konami, searchFilter, selectFilter, Hotkeys, ngDialog){

	this.debug = function(arg){
	    console.log($scope);
	};

	
	
	// if someone attempts to reload the page, logout the current user
	// Server.logout();

	//this serves the chronological filter
	this.chronological = 'time';
	var orderBy = $filter('orderBy');
	
        //an easter egg
        $scope.unicorn = false;
        $rootScope.$on('konamiEvent', function(e, a){
	    $scope.unicorn = !$scope.unicorn;
	    window.setTimeout(function(){
		$scope.unicorn = false;
		$scope.$apply();
	    }, 1000*60*5);
	});
	
	//disable tab key 'cause it triggers sh*t
	document.onkeydown = function (e) {
            if(e.which == 9){
                return false;
            }else{
		return true;
	    }
	};

	//a refresh method
	this.refresh = function(){
            $scope.sell.customer.refresh();
            $scope.sell.drink.refresh();
            //Gotta reload Hotkeys' binding
            $scope.sell.loadHotkeys();
	    //Set the focus back
	    Focus.setLocation('drink');
        };
        
	//setting up watches so the highlighted item will always be zero during a search
        //$scope.$watch(this.customer.keyword, this.customer.blockIndex);
        //$scope.$watch(this.drink.keyword, this.drink.blockIndex);

	this.confirm = function(){
            var dialog = ngDialog.open({
                template: 'confirm/confirm.tpl.html',
                controller: 'ConfirmCtrl as confirm',
                data: [$scope.sell.customer.details, $scope.sell.drink.details, $scope.sell.customer.getActualMoney()],
                className: 'ngdialog-theme-plain',
                showClose: false,
                closeByEscape: false,
                closeByDocument: false
            });
            dialog.closePromise.then(function(promised){
		console.log(promised.value);
                $scope.sell.refresh();
	    });
        };
	
        // takes the money value and returns an appropriate color
	this.getMoneyColor = function(){
	    //if (this.customer.details === null){
		return '#EE999C'; //pink
	    /*}else{
		var money = this.customer.getActualMoney();
		//resolve appropriate color
		if(money > 15){
		    return '#15BF25'; //green
		}
		else if(money > 10){
		    return '#FFA005'; //yellow
		}
		else if(money > 5){
		    return '#FF5900'; //orange
		}
		else{
		    return '#E5251E'; //red
		}
	    }*/
	};

	// convert a date to something readable
	this.toDateString = function(date){
	    var dateObj = new Date(parseInt(date, 10));
	    return dateObj.toDateString();
	};

	//For we need to know where the focus is when using the mouse
	this.tellInputFocus = function(whichInput){
	    Focus.setLocation(whichInput);
	};

        //For we must be able to enter confirmation mode when using the mouse
        this.mouseAttempt = function(){
            if(this.customer.details !== null && this.drink.details !== null){
                this.confirm();
            }
        };


	//When one needs to add some money
	this.makeDeposit = function(){
	    Focus.lose();
	    this.disableHotkeys();
            var dialog = ngDialog.open({
                template: 'deposit/deposit.tpl.html',
                controller: 'DepositCtrl as deposit',
                data: [$scope.sell.customer.details],
                className: 'ngdialog-theme-plain',
                showClose: false,
                closeByEscape: false,
                closeByDocument: false
            });
            dialog.closePromise.then(function(promised){
		console.log(promised.value);
		$scope.sell.refresh();
	    });
	};

	
	//When an user is authenticated through time, we gotta diplay it
	this.authenticatedUser = null;
	this.remainingTime = 0;
	$rootScope.$on('yAuthEvent', function(e, a){ 
	    $scope.sell.authenticatedUser = a.login;
	    var time = (new Date()).getTime();
	    var remain = a.endTime-time>0?a.endTime-time:0;
	    $scope.sell.remainingTime = Math.floor(remain/(1000*60));
	    var updateCountdown = function(){
		window.setTimeout(function(){
		    $scope.sell.remainingTime--;
		    if($scope.sell.remainingTime<0){
			$scope.sell.authenticatedUser = null;
			$scope.sell.remainingTime = 0;
		    }else{
			updateCountdown();
		    }
		    $scope.$apply();
                }, 60*1000);
	    };
	    updateCountdown();
	});

	
        //This sets up some hotkeys
	this.loadHotkeys = function(){
            Hotkeys.add({
                combo: 'enter',
                description: 'Move to the next field',
                callback: hotkConfirm,
		allowIn: ['INPUT']
            });
            Hotkeys.add({
                combo: 'escape',
                description: 'Move to the previous field',
                callback: hotkCancel,
                allowIn: ['INPUT']
	    });
	    Hotkeys.add({
                combo: 'up',
                description: 'Move upward the selected field',
                callback: hotkUp,
                allowIn: ['INPUT']
	    });
	    Hotkeys.add({
                combo: 'down',
                description: 'Move downward the selected field',
                callback: hotkDown,
                allowIn: ['INPUT']
	    });
            Hotkeys.add({
                combo: 'left',
                callback: hotkLeft
            });
            Hotkeys.add({
                combo: 'right',
                callback: hotkRight
            });
            Hotkeys.add({
                combo: 'a',
                callback: hotkA
            });
            Hotkeys.add({
                combo: 'b',
                callback: hotkB
            });
	};

	this.disableHotkeys = function(){
	    Hotkeys.del('up');
	    Hotkeys.del('down');
	    Hotkeys.del('left');
	    Hotkeys.del('right');
            Hotkeys.del('a');
	    Hotkeys.del('b');
            Hotkeys.del('enter');
	    Hotkeys.del('escape');
	};

        var hotkConfirm = function(){
            if(Focus.forward()){ //isWaitingForConfirm
                $scope.sell.confirm();
	    }else{
		$scope.sell.customer.refresh();
		$scope.sell.drink.refresh();
	    }
        };
        var hotkCancel= function(){
	    Focus.backward();
            $scope.sell.customer.refresh();
            $scope.sell.drink.refresh();
        };
	var hotkUp = function(){
	    Konami.on('up');
	    if(Focus.getLocation() === 'customer'){
                $scope.sell.customer.up();
	    }else if(Focus.getLocation() === 'drink'){
		$scope.sell.drink.up();
	    }
	};
	var hotkDown = function(){
	    Konami.on('down');
	    if(Focus.getLocation() === 'customer'){
                $scope.sell.customer.down();
            }else if(Focus.getLocation() === 'drink'){
                $scope.sell.drink.down();
            }  
	};
	var hotkLeft = function(){
	    Konami.on('left');
	};
	var hotkRight = function(){
	    Konami.on('right');
        };
	var hotkA = function(){
	    Konami.on('a');
        };
	var hotkB = function(){
	    Konami.on('b');
        };
	this.loadHotkeys();
	
    }]);
