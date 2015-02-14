angular.module('babar.easter', [])
/**
 * Sets up some cool bonuses for bored drinkers.
 */

    .factory('Konami', ['$rootScope', function($rootScope){

	Konami = function(){

	    var code = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
	    var index = 0;
	    
	    this.on = function(key){
		if(key === code[index]){
		    ++index;
		    if(index === code.length){
			$rootScope.$emit('konamiEvent', {});
			index = 0;
		    }
		}else{
		    index = 0;
		}
	    };

	};

	return new Konami();

    }]);
