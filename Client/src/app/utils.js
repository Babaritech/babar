angular
    .module('babar.utils',[
    ])
    .filter('search', function() {
        return function(input, keyword){
            return input.filter(function(ival, ind, arr) {
		// turn off this option if this is too slow
		var TEST_CHAR_BY_CHAR = true;
		// if there're special elements, keep them
		if(ival.id < 0) {
		    return true;
		}
		else {
		    if(TEST_CHAR_BY_CHAR) {
			//test if all the letters of the keyword are included in the name
                        return keyword.split('').every(function(kval, ind, arr) {
                             return ival.name.toLowerCase().indexOf(kval.toLowerCase()) > -1;
                        });
		    }
		    else {
                    // test if keyword is included in the name
                    return ival.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
		    }
                    
		}
            });
        };
    })
    .filter('select', function() {
        //update each item 'active' value for item highlighting
        return function(input, index) {
            return input.map(function(val, ind, arr) {
                if(ind === index) {
                    val.active = true;
                }else {
                    val.active = false;
                }
                return val;
            });
        };
    })
    .filter('cut', function() {
	return function(input, count) {
	    return input.splice(0, parseInt(count, 10) || 5);
        };
    });
