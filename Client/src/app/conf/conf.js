angular
    .module('babar.conf', [
	'babar.server',
	'babar.error',
	'ngMaterial'
    ])
    .controller('ConfCtrl', function($rootScope, $mdDialog, Server, Toast, customer, drink) {


	this.message = drink.details.name + ' for ' + customer.details.name;
	this.overdraft = customer.getActualMoney() - drink.details.price <= 0;
        
        this.cancel = function() {
	    new Toast().display('purchase cancelled');
            $mdDialog.cancel();
	};

	this.confirm = function() {
	    if(!this.overdraft) {
                Server.create.purchase({
                    customer: customer.details,
                    drink: drink.details
                }).then(function() {
                    $rootScope.$emit('refresh', {'from': 'confirm', 'to': 'all'});
                    new Toast().display('purchase done');
		    $mdDialog.hide();
		});
	    }
	    else {
                Server.create.purchase_overdraft({
                    customer: customer.details,
                    drink: drink.details
		}).then(function() {
                    $rootScope.$emit('refresh', {'from': 'confirm', 'to': 'all'});
                    new Toast().display('purchase done');
		    $mdDialog.hide();
		});
	    }
	};
    });
