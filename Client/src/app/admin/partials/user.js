angular.module('babar.admin.user', [
    'babar.server'
])

    .filter('chronological', [function(){
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
    }])

    .controller('AdmUserCtrl', ['$scope', '$state', '$stateParams', 'Server', function($scope, $state, $stateParams, Server){


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
