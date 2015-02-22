angular
    .module('babar.deposit', [
    'babar.server',
    'cfp.hotkeys'
])
    .controller('DepositCtrl', function($rootScope, $scope, Server, customer, user){
	

	this.customer = customer.details;
	this.user = user;
	this.money = 0;

	this.error = "";
        this.cancel = function() {
            new Toast().display('deposit cancelled');
            $mdDialog.cancel();
        };
	
	this.confirm = function(){
	    if(this.money === 0){
		this.error = "Can't deposit no money.";
	    }else if(this.money > 100){
		this.error = "Can't deposit more than 100€ at a time.";
	    }else{
		Server.create.deposit({
		    customer: this.customer,
		    amount: this.money,
		    user: this.user
		}).then(function() {
		    $rootScope.$emit('refresh', {'from': 'deposit', 'to': 'all'});
		    $mdDialog.hide();
                });
	    }
        };
    });
