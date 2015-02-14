angular.module('babar.admin.user', [
    'babar.sell',
    'babar.server'
])

    .controller('AdmUserCtrl', ['$scope', '$state', '$stateParams', 'Server', function($scope, $state, $stateParams, Server){

	//this serves the chronological filter
	this.chronological = 'time';

	//Selected user
	this.current = null;
	
	//Get the selected user
	var response = Server.getAdminDetails('user', $stateParams.id);
        if(response.status !== 200){
	    //TODO ('cause a bit extreme)
	    $state.go('sell');
        }else{
	    response.data.then(function(result){
		//update the current user
		result.history.map(function(val, ind, arr){
		    val.date = (new Date(val.time)).toDateString();
		});
		$scope.admusr.current = result;
	    });
        }
    }]);
