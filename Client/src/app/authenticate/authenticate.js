angular.module('babar.authenticate', [
    'babar.server',
    'babar.error',
    'cfp.hotkeys'
])
    .controller('AuthenticateCtrl', ['$scope', '$state', 'Server', 'hotkeys', function($scope, $state, Server, Hotkeys){

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
	
	
	//in case of confirmation
	$scope.confirm = function(){
	    if($scope.authForm.$valid === true){
		//form's well filled, ask permission
		var promise = Server.authenticate($scope.auth.login, $scope.auth.password, $scope.auth.chosenDuration);
		promise.then(function(promised) { //allright
		    $scope.closeThisDialog('authenticated');
		}, function(promised) { //there's an error
		    if(promised.status === 403) {
			$scope.auth.error = "Wrong login/password combination.";
		    }
		    else {
			$state.go('error', {'status': promised.status.toString()});
		    }
		});
            }
        };

	//in case of cancel
	$scope.cancel = function(){
	    $scope.closeThisDialog('cancelled');
        };


	$scope.selectField = function(){
	    if(document.getElementById('loginInput') === document.activeElement){
		document.getElementById('passwordInput').focus();
	    }else{
		document.getElementById('loginInput').focus();
	    }
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
