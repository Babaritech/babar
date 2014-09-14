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
        this.debug = function(){
            console.log(this.keyword);
        };

	// current research
	this.keyword = "";

	this.currentClient = {
	    info: null,
	    current: null,
	    change: function(newClient){
                this.current = newClient;
		this.info = TestFct.getInfo(newClient.id);
	    },
	    getClass: function(aClient){
		if(aClient === this.current){
		    return 'list-group-item active';
		}else{
		    return 'list-group-item';
		}
	    }
	};

	//load clients' list
	this.clients = TestFct.getClients();


	// takes the money value and returns an appropriate color
	this.getMoneyColor = function(){
	    if (this.currentClient.info === null){
		return '#EE999C'; //pink
	    }
	    else if(this.currentClient.info.money > 15){
		return '#15BF25'; //green
	    }
	    else if(this.currentClient.info.money > 10){
		return '#FFA005'; //yellow
	    }
	    else if(this.currentClient.info.money > 5){
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






