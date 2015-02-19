angular.module('babar.authenticate', [
    'babar.server',
    'babar.error',
    'ngMaterial',
    'cfp.hotkeys'
])
    .controller('AuthenticateCtrl', function($scope, $state, $mdDialog, Server, Toast, hotkeys){

	this.login = "";
	this.password = "";

	this.error = "";

	this.allowedThroughTime = true;
	this.durations = [0, 5, 15, 30, 60, 120, 240].map(function(val, ind, arr) {
	    return {
		label: val === 0 ? 'Just this time' : val.toString() + ' min',
		value: val
	    };
	});
	this.chosenDuration = 0;
 
	$scope.cancel = function() {
	    new Toast().display("login cancelled");
	    $mdDialog.cancel();
	};
	
	//in case of confirmation
	$scope.confirm = function(){
	    if($scope.authForm.$valid === true){
		//form's well filled, ask permission
		Server.authenticate({
		    login: $scope.auth.login,
		    password: $scope.auth.password,
		    duration: $scope.auth.chosenDuration
		}).then(function(promised) {
		    // auth allright, back to what we where at
		    new Toast().display("login passed");
                    $mdDialog.hide();
		}, function(promised) {
		    new Toast().display("login failed");
                    if(promised.status === 403) {
			$scope.auth.error = "Wrong login/password combination.";
		    }
		    // else error module (called by server module)
		});
            }
        };

	$scope.selectField = function(){
	    if(document.getElementById('loginInput') === document.activeElement){
		document.getElementById('passwordInput').focus();
	    }else{
		document.getElementById('loginInput').focus();
	    }
        };
	
        hotkeys.add({
            combo: 'tab',
            description: 'Select the right field',
            callback: $scope.selectField,
            allowIn: ['INPUT']
            });
	//No need to set up and enter hotkey for angular do it by itself in forms
        // Hotkeys.add({
        //     combo: 'enter',
        //     description: 'Authenticate the sale',
        //     callback: $scope.confirm,
        //     allowIn: ['INPUT']
        // });
    });
