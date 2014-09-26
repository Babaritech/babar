angular.module('babar.admin.customer', [
    'babar.server'
])
    .controller('AdmCustomerCtrl', ['$scope', '$stateParams', 'Server', function($scope, $stateParams, Server){

	// console.log($stateParams);
	// this.current = null;
        // // var response = Server.getAdminDetails('customer', $stateParams.item.id);
        // // if(response.status !== 200){
        // //     //TODO ('cause a bit extreme)
        // //     // $state.go('sell');
        // // }else{
        // //     response.data.then(function(result){
        // //         $scope.admcst.current = result;
        // //     });
        // // }
	
        // this.isReadOnly = true;
	// this.toWritingMode = function(){
	//     this.isReadOnly = false;
	// };
	
    }]);
