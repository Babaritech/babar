angular.module('babar.authenticate', [
    'babar.server',
    'babar.error',
    'ngMaterial',
    'cfp.hotkeys'
])
    .controller('AuthenticateCtrl', function($scope, $state, $mdDialog, Server, hotkeys){

	this.login = "";
	this.password = "";

	//if you wanna have a simple confirmation for an already logged user, use $stateParams to set this boolean to true
	this.hasAccess = false;
	
	this.error = "";

	this.allowedThroughTime = true;
	this.availableDurations = [0, 5, 15, 30, 60, 120, 240];
	this.chosenDuration = 0;
	this.durationToDisplay = "Just this time";
	this.chooseDuration = function(duration){
	    this.chosenDuration = duration;
	    this.durationToDisplay = duration.toString() + ' min';
	};


	$scope.cancel = function() {
	    console.log("login cancelled");
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
		    console.log("login passed");
                    $mdDialog.hide();
		}, function(promised) {
		    console.log("login failed");
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
