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
	
	this.duration = 0;
 
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
		    duration: $scope.auth.duration
		}).then(function(promised) {
		    // auth allright, back to what we where at
		    new Toast().display("login passed");
                    $mdDialog.hide(promised);
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
            combo: 'enter',
            description: 'Authenticate the sale',
            callback: $scope.confirm,
            allowIn: ['INPUT']
        });
    });
