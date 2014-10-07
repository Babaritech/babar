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

	this.allowedThroughTime = true;
	this.availableDurations = [0, 5, 15, 30, 60, 120, 240];
	this.chosenDuration = 0;
	this.durationToDisplay = "Just this time";
	this.chooseDuration = function(duration){
	    this.chosenDuration = duration;
	    this.durationToDisplay = duration.toString() + ' min';
	};

	
	//if the requests concerns admin rights, lot of things change
	if(this.data.admin){
	    this.hasAccess = false;
	    this.allowedThroughTime = false;
	}
	
	//in case of confirmation
	$scope.confirm = function(){

	    if($scope.auth.hasAccess){
		//already has access, perform the sh*t
		perform();
	    }else if($scope.authForm.$valid === true){
		//form's well filled, ask permission
		current.reset();
		var response = Rights.ask($scope.auth.login, $scope.auth.password, $scope.auth.chosenDuration, $scope.auth.data.admin);	
                if(response !== 'ok'){
		    //permission not granted
                    $scope.auth.error = response;
                }else{
		    //permission granted
                    if(!$scope.auth.data.admin){
			//if this isn't about going to the config page, perform an action
                        perform();
                    }else{
			//this is about config, no action to perform
                        $scope.closeThisDialog('admin');
                    }
                }
            }
        };

	//in case of cancel
	$scope.cancel = function(){
            $scope.closeThisDialog('cancelled');
        };

	var perform = function(){
            var response = Server.perform($scope.auth.action, {customer:$scope.auth.customer, data:$scope.auth.data});
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
