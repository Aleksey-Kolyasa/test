define(['angular'], function(angular){
	"use strict"
	var chatApp = angular.module('chatApp', ['chatServices', 'toastr', 'ngAnimate'])
		.constant('apiURL', 'http://localhost:2403/items/')
		.controller('chatAppCtrl', function($scope, $http, $log, $location, $window, $interval,$rootScope, apiURL, ResourceService, MessageService, toastr) {
				
			/*init var's  list *START* */
				/*USER DATA*/
				$scope.currentView = "login";	
				$scope.usersDB = [];
				$scope.loggedUser = Object.create(null);
				/*MSG Input DATA*/
				$scope.msgList = [];
				$scope.msgTo = null;
			/*init var's  list *END* */

			/* Get init data from DB *START* */
				$scope.update = function() {
					if($scope.loggedUser.id)
					{
						$http.get(apiURL)
								.then(data =>
									{
										$scope.usersDB = data.data; //.data[0].username;

										$scope.chatMSG.getMSG();
									}
								)
								.catch(error =>
									{
										$log.warn("Error happened: " + error);
									});
					}
				};
			/* Get init data from DB *END* */

			/* View controll *START* */
				$scope.view = {
					changeView : function (view)
                    {
						$scope.currentView = view;
						$location.path("/" + view);

						if(view === 'chat')
						{
							$scope.update();
						}
					}
				};
			/* View controll *END* */


			/* Data Update Interval *START* */
				$interval( function() {
					$scope.update();
				}, 2000);
			/* Data Update Interval *END* */


			/*User Register-Login-logout *START* */
				$scope.userAuthorization =
				{
					userName : "",
					userPassword : "",

					 clear : function()
					{
						this.userName  = "";
						this.userPassword  = "";
					},
					userRegister : (name, password) => {

						ResourceService
							.doRegister(name, password)
								.then(data => {

										if (data === true)
										{
											$scope.userAuthorization.clear();
											$scope.view.changeView('login');

											toastr.success("Registration is completed. Please, login now");
										}
									},
									error => {
										throw new Error("CTRL PRM FAILD");
								});
					},
					userLogin : (name, password) => {

						ResourceService
							.doLogin(name, password)
								.then(userID => { // user.id || error

										if (userID)
										{
											$scope.userAuthorization.clear();	// clear user name/password input data

											ResourceService._ajaxRequest('GET', userID)
												.then(user =>{
													$scope.loggedUser = user;
													return $scope.loggedUser;
												})
												.then(loggedUser => {
													$scope.update();
													$scope.view.changeView('chat');
													toastr.success("Dear " + loggedUser.name + "! Welcome back!");
												})


										}
									},
									error => {
										throw new Error("CTRL PRM FAILD");
								});

					},
					userLogout : (user)=> {
							ResourceService.doLogout(user)
								.then(user =>{
									if(!user.loginStatus)
									{
										return toastr.info("Good bye, " + user.name + "!!!");
									}
								})
								.then( ()=> {
									$scope.view.changeView('login');
								});
					}
				};
			/*User Register-Login-logout *END* */


			/* Chat Function *START* */
				$scope.chatMSG =
				{
					msgText : "",

					getMSG : function()
					{
						MessageService.getMSGdata()
							.then(data => {

								$scope.msgQty = data.length;

								if(data.length > 30)
								{
									toastr.info(data.length);
									MessageService.cleanMSGdb(10, 30);
								}

								$scope.msgList = [];

								angular.forEach(data.slice(-25), function(msg){
									$scope.msgList.push(msg);
								});
							});
					},

					postMSG : function(msg)
					{
						if(msg)
						{
							let userMsg =
							{
								msgSender : $scope.loggedUser.name,
								msgDate   : Date.now(),
								msgTo     : $scope.msgTo,
								msgText   : msg
							};


							MessageService.postUserMSG(userMsg)
								.then( () => {
									$scope.update();
								});
						}
						else {
								toastr.error('Enter the message text');
								this.msgText = "";
								return;
							}

						this.msgText = '';
						$scope.msgTo = '';
					},

					msgToUser : function(user)
					{
						if(user.loginStatus)
						{
							if(user.name == $scope.loggedUser.name)
							{
								toastr.error("This is You!");
								return;
							}
							else {
								$scope.msgTo = user.name;
							}
						}
						else{
							toastr.error( user.name + " is Offline...");
							return;
						}

					},

					msgToUserCancel : function()
					{
						$scope.msgTo = "";
						this.msgText = '';
					}
				};
			/* Chat Function *END* */

			/* If reload or window.close, do logout *START* */
				$window.onbeforeunload = function() {
					if($scope.loggedUser.id)
					{
						$scope.userAuthorization.userLogout($scope.loggedUser);
					}
				};
			/* If reload or window.close, do logout *END* */

			/*init var's  list *END* */

			/* Get init data from DB *START* */
				$scope.update = function() {
					if($scope.loggedUser.id)
					{
						$http.get(apiURL)
								.then(data =>
									{
										$scope.usersDB = data.data; //.data[0].username;

										//$log.log(data);

										$scope.chatMSG.getMSG();
									}
								)
								.catch(error =>
									{
										$log.warn("Error happened: " + error);
									});
					}
				};
			/* Get init data from DB *END* */

			/* View controll *START* */
				$scope.view =
				{
					changeView : view =>
					{
						$scope.currentView = view;
						$location.path("/" + view);

						if(view === 'chat')
						{
							$scope.update();
						}
					}
				}
			/* View controll *END* */


			/* Data Update Interval *START* */
				$interval( ()=> {
					$scope.update();
				}, 2000);
			/* Data Update Interval *END* */


			/*User Register-Login-logout *START* */
				$scope.userAuthorization =
				{
					userName : "",
					userPassword : "",

					 clear : function()
					{
						this.userName  = "";
						this.userPassword  = "";
					},
					userRegister : function(name, password) {

						ResourceService.doRegister(name, password)
							.then( data => {
										if (data === true)
										{
											$scope.userAuthorization.clear();
											$scope.view.changeView('login');
											toastr.success("Registration is completed. Please, login now");
										}
									},
									error => {
										throw new Error("CTRL PRM FAILD");
								});
					},
					userLogin : function(name, password) {

						ResourceService.doLogin(name, password).then(
						    function(userID)
                            { // user.id || error
										if (userID)
										{
											$scope.userAuthorization.clear();	// clear user name/password input data

                                            ResourceService._ajaxRequest('GET', userID).then(function(user) {
													$scope.loggedUser = user;
													return $scope.loggedUser;
                                            }).then(function(loggedUser) {
													$scope.update();
													$scope.view.changeView('chat');
													toastr.success("Dear " + loggedUser.name + "! Welcome back!");
												});
										}
                            },
                            function(error)
                            {
										throw new Error("CTRL PRM FAILD");
                            });

					},
					userLogout : (user)=> {
							ResourceService.doLogout(user)
								.then(user =>{
									if(!user.loginStatus)
									{
										return toastr.info("Good bye, " + user.name + "!!!");
									}
								})
								.then( ()=> {
									$scope.view.changeView('login');
								});
					}
				};
			/*User Register-Login-logout *END* */


			/* Chat Function *START* */
				$scope.chatMSG =
				{
					msgText : "",

					getMSG : function()
					{
						MessageService.getMSGdata()
							.then(data => {

								$scope.msgQty = data.length;

								if(data.length > 30)
								{
									toastr.info(data.length);
									MessageService.cleanMSGdb(10, 30);
								}

								$scope.msgList = [];

								angular.forEach(data.slice(-25), function(msg){
									$scope.msgList.push(msg);
								});
							});
					},

					postMSG : function(msg)
					{
						if(msg)
						{
							let userMsg =
							{
								msgSender : $scope.loggedUser.name,
								msgDate   : Date.now(),
								msgTo     : $scope.msgTo,
								msgText   : msg
							};


							MessageService.postUserMSG(userMsg)
								.then( () => {
									$scope.update();
								});
						}
						else {
								toastr.error('Enter the message text');
								this.msgText = "";
								return;
							}

						this.msgText = '';
						$scope.msgTo = '';
					},

					msgToUser : function(user)
					{
						if(user.loginStatus)
						{
							if(user.name == $scope.loggedUser.name)
							{
								toastr.error("This is You!");
								return;
							}
							else {
								$scope.msgTo = user.name;
							}
						}
						else{
							toastr.error( user.name + " is Offline...");
							return;
						}

					},

					msgToUserCancel : function()
					{
						$scope.msgTo = "";
						this.msgText = '';
					}
				};
			/* Chat Function *END* */

			/* If reload or window.close, do logout *START* */
				$window.onbeforeunload = function() {
					if($scope.loggedUser.id)
					{
						$scope.userAuthorization.userLogout($scope.loggedUser);
					}
				};
			/* If reload or window.close, do logout *END* */

	}); // CTRL END**
	
	return chatApp;
});

