angular.module('babar.authenticate', [
    'babar.server',
    'babar.rights',
    'cfp.hotkeys'
])
    .controller('AuthenticateCtrl', ['$scope', 'Server', 'Rights', 'hotkeys', function($scope, Server, Rights, Hotkeys){

	this.customer = $scope.ngDialogData[0];
	this.action = $scope.ngDialogData[1];
	this.data = $scope.ngDialogData[2];

	this.login = "";
	this.password = "";
	this.hasAccess = Rights.can();

	this.error = "";

	
	$scope.confirm = function(){
	    if(!$scope.auth.hasAccess){ //not authorized, gotta authenticate or cancel
		if($scope.auth.login === "" && $scope.auth.password === ""){
		    $scope.auth.error = "You must provide a valid login/password combination or cancel.";		}else{
			var response = Rights.ask($scope.auth.login, $scope.auth.password, 0);
                        if(response !== 'ok'){
                            $scope.auth.error = response;
                        }else{
			    perform();
                        }
		}
	    }else{
		perform();
	    }
        };
	
	$scope.cancel = function(){
            $scope.closeThisDialog('cancelled');
        };

	var perform = function(){
            var response = Server.perform($scope.auth.action, {customer:$scope.auth.customer, amount:$scope.auth.data.amount});
	    if(response==='ok'){
		$scope.closeThisDialog('success');
	    }else{
		$scope.auth.error = response;
		$scope.auth.hasAccess = false;
	    }
        };

	var tabs = 0;
	$scope.selectField = function(){
	    if(tabs%2 === 0){
		document.getElementById('loginInput').focus();
	    }else{
		document.getElementById('passwordInput').focus();
	    }
	    tabs++;
        };


        //Let's set up some hotkeys !
        Hotkeys.add({
            combo: 'enter',
            description: 'Authenticate the sale',
            callback: $scope.confirm,
	    allowIn: ['INPUT']
        });
	Hotkeys.add({
            combo: 'escape',
            description: 'Cancel the sale',
            callback: $scope.cancel,
	    allowIn: ['INPUT']
        });
        Hotkeys.add({
            combo: 'tab',
            description: 'Select the right field',
            callback: $scope.selectField,
            allowIn: ['INPUT']
        });
    }]);
