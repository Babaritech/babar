angular.module('babar.sell', [
    'babar.test'
])

    .controller('SellCtrl', ['TestFct', function(TestFct){
	this.clients = TestFct.getClients(); 
    }]);
