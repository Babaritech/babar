angular.module('babar.authenticate', [
    'babar.server',
    'babar.rights',
    'cfp.hotkeys'
])
    .controller('AuthenticateCtrl', ['$scope', 'Server', 'Rights', 'hotkeys', function($scope, Server, Rights, Hotkeys){

	this.login = "";
	this.password = "";
	
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
		Server.authenticate();
		$scope.closeThisDialog('authentication');
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
