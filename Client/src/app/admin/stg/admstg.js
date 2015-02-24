angular.module('babar.admin.setting', [
    'ngMaterial',
    'ui.router'
])
    .factory('AvailableSettings', function($q, $timeout) {
	function AvailableSettings() {

	    this.list = function() {
		return [
		    {
			id: 1,
			name: 'Search',
			parameters: [
			    {
				name: 'charSearch',
				element: 'switch',
				type: null,
				description: 'Search for occurrences that contain every character instead of the whole keyword. May affect performances.',
				defaultValue: false
			    },
			    {
				name: 'cutNumberSearch',
				element: 'input',
				type: 'number',
				description: 'Number of results displayed under the search bars. May affect performances.',
				defaultValue: 5
			    }
			]
		    }
		];
	    };

	    this.promise = function() {
		var list = {data:this.list()};
		var deffered = $q.defer();
		$timeout(function() {
		    deffered.resolve(list);
		});
		return deffered.promise;
	    };
	}
	return new AvailableSettings();
    })
    .controller('AdmSettingCtrl', function($rootScope, $scope, $state, $stateParams, AvailableSettings){
	this.parameters = AvailableSettings.list().filter(function(val, ind, arr) {
	    return val.id === parseInt($stateParams.id, 10);
	})[0].parameters;
	
    });
