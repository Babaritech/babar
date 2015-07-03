angular
.module('babar.utils',[
])
.filter('search', function() {
	return function(input, keyword){
		// First, attempt a search on the exact word (case insensitive, though)
		// If there is no result, make the search char by char
		var filteredByWord = input.filter(function(ival, ind, arr) {
			// if there're special elements, keep them
			if(ival.id < 0) {
				return true;
			}
			else {
				// test if keyword is included in the name
				return ival.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
			}
		});
		return filteredByWord.length !== 0 ?
			filteredByWord :
			input.filter(function(ival, ind, arr) {
			// if there're special elements, keep them
			if(ival.id < 0) {
				return true;
			}
			else {
				//test if all the letters of the keyword are included in the name
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
})
.filter('cut', function() {
	return function(input, count) {
		return input.splice(0, parseInt(count, 10) || 5);
	};
});
