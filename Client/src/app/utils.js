angular
    .module('babar.utils',[
    ])
    .filter('search', function() {
        return function(input, keyword){
            return input.filter(function(ival, ind, arr) {
		// if there're special elements, keep them
		if(ival.id < 0) {
		    return true;
		}
		else {
                    // test if keyword is included in the name
                    //return val.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;

                    //test if all the letters of the keyword are included in the name
                    //choose the above if this is too slow
                    return keyword.split('').every(function(kval, ind, arr) {
			return ival.name.toLowerCase().indexOf(kval.toLowerCase()) > -1;
                    });
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
    });
