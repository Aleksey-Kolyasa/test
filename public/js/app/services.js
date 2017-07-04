define(['angular'], function(angular){

	"use strict"
	var chatServices = angular.module('chatServices', ['toastr', 'ngAnimate']);

	chatServices.constant('apiURL', 'http://localhost:2403/items/');
	chatServices.constant('msgURL', 'http://localhost:2403/msg/');

	chatServices.service('ResourceService', 
		function($log, $http, $q, $location, apiURL, msgURL, toastr)
		{	
			return { 
				
				baseURL : "http://localhost:2403/items/",

				_ajaxRequest : function (method, url, data) 
				{	
					var deferred = $q.defer();
					
					let chain = Promise.resolve();
					
					chain.then( () => {	
					
						switch(method)
						{
							case 'GET' :
								if(!url)
								{
									$http({	url : this.baseURL})
									.success( dataObj => 
										{
										 	deferred.resolve(dataObj);
										})
									.error( err => 
										{	
											toastr.error("ERROR: method 'GET' - faild!");
											throw new Error("ERROR: method 'GET' - faild!");
										});
								}
								if(url)
								{
									$http({	url : this.baseURL + url})
									.success( dataObj => 
										{
										 	deferred.resolve(dataObj);
										})
									.error( err => 
										{	
											toastr.error("ERROR: method 'GET' - faild!");
											throw new Error("ERROR: method 'GET' - faild!");
										});
								}
							break;

							case 'POST' :

								$http({	url : this.baseURL, method : 'POST', data : data})
									.success( dataObj => 
									{	
										deferred.resolve(dataObj);
									})
									.error(err => 
										{	
											toastr.error("ERROR: method 'POST' - faild!");
											throw new Error("ERROR: method 'POST' - faild!" + err);
										});
							break;

							case 'PUT' :

								$http({	url :  this.baseURL + data.id, method : "PUT", data : data})
									.success( dataObj => 
										{
											deferred.resolve(dataObj);
										})
									.error(err => 
										{	
											toastr.error("ERROR: method 'PUT' - faild!");
											throw new Error("ERROR: method 'PUT' - faild!");
										});
							break;

							case 'DELETE' :

								$http({	url :  this.baseURL + url, method : "DELETE"})
									.success( dataObj => 
										{
											
										})
									.error(err => 
										{	
											toastr.error("ERROR: method 'DELETE' - faild!");
											throw new Error("ERROR: method 'DELETE' - faild!");
										});
							break;

							default : 
								toastr.error('ERROR: invalid method!');
								throw new Error('ERROR: invalid method!');

							break;
						}
					})
					.catch(err => { $log.warn(err); });
					
					return deferred.promise;
				},

				doRegister : function(userName, userPassword)
				{	
					let chain = Promise.resolve();
					
					chain = chain.then( () => {
							
								if(userName && userPassword)
								{
									if( userName !== userPassword)
									{	//create intermediate USER obj.
										 let input = 
										 {
										 	name : userName,
										 	password : userPassword,
										 	loginStatus : "false",
										 	loginDate : null,
										 	registerDate : Date.now()
										 };

										return input; // return intermediate USER obj.
									} 
									else 
										{ 	
											toastr.error("ERROR: Password and Name cannot be the same!");
											throw new Error("ERROR: Password and Name cannot be the same!"); 
										}
								}
								else 
									{ 	
										toastr.error("ERROR: Enter correct name and password!");
										throw new Error("ERROR: Enter correct name and password!"); 
									}
					})
					.then(data => { //data = intermediate USER obj || error
						let userNameAlreadyExist = false; 
						
						//Do check: User Input Name is occupied?
						let check = this._ajaxRequest('GET').then(users => { // users = users Array in DB
							
							angular.forEach( users, function(user) { // user = single user unit in DB
								 	if (user.name === data.name) // if true, name is occupied already
								 	{
								 		userNameAlreadyExist = true; 
								 	}
							});

							if(!userNameAlreadyExist) // if name is free
							{
								return data; //data = intermediate USER obj
							}
							else { // if name is ocuppied
									toastr.error("ERROR: User with such name already exist, try another one");
									throw new Error("ERROR: Such name already is occupied"); 
								}	
						});
						
						return check; //check = data = intermediate USER obj || error
					})
					.then(data => {	 //data = check from previous = intermediate USER obj
							return this._ajaxRequest('POST', null, data); // do POST (do register new User)
					})
					.then(data => { // if all ok - return true
						return true;
					})
					.catch(err => { 
						toastr.error("ERROR: Register faild");
						$log.warn(err); 
					});

					return chain; // chain = true || error (return result to Ctrl doRegister fn)
				},

				doLogin : function(userName, userPassword)
				{	
					let chain = Promise.resolve();
						
					chain = chain.then( data => { // data - empty
							return this._ajaxRequest('GET');
					})
					.then(data => { // data = users Array list || error
							let self = this;
							let userID = '';
							let userIsFound = false;

							 angular.forEach(data, function(user) { // user = single user in users Array list in DB
								 	// if inputed name and password conside with any in users Array list in DB
								 	if (user.name === userName && user.password === userPassword) 
								 	{
								 		user.loginStatus = true; // login status = true;
								 		user.loginDate = Date.now();

								 		self._ajaxRequest('PUT', null, user); // update login status in DB

							 			userID = user.id;
								 		userIsFound = true; // all ok, user is found, proceed next check point
								 	}
							});

							if (userIsFound == true) // if user is found
							{	
								$location.path("/chat");

							 	return userID;
							}
							else // if user is not found
								{ 	toastr.error('ERROR: wrong name or password');
									throw new Error('ERROR: User not found'); 
								}
					})
					.catch(err => { 
							$log.warn(err);
							toastr.error('ERROR: Login faild');
					});

					return chain; // login status = true || error (return result to Ctrl doLogin fn)
				},

				doLogout : function(user)
				{
					let currentUser = user;
						currentUser.loginStatus = false;
					
					let chain = Promise.resolve(currentUser);

					chain = chain.then( currentUser => {
							return this._ajaxRequest('PUT', currentUser.id, currentUser);
					})
					.then(updatedUser => {
						return updatedUser;
					})
					.catch(err => { 
							$log.warn(err);
							toastr.error('ERROR: Logout faild');
					});

					return chain;
				},
			};	
		}
	);

	chatServices.service('MessageService', 
		function($log, $http, $q, $location, apiURL, msgURL, toastr)
		{
			return {

				_ajaxRequestMSG : function (method, url, data) 
				{	
					var deferred = $q.defer();
					
					let chain = Promise.resolve();
					
					chain.then( () => {	
					
						switch(method)
						{
							case 'GET' :
								if(!url)
								{
									$http({	url : msgURL})
									.success( dataObj => 
										{
										 	deferred.resolve(dataObj);
										})
									.error( err => 
										{	
											toastr.error("ERROR: MSG method 'GET' - faild!");
											throw new Error("ERROR: MSG method 'GET' - faild!");
										});
								}
								if(url)
								{
									$http({	url : msgURL + url})
									.success( dataObj => 
										{
										 	deferred.resolve(dataObj);
										})
									.error( err => 
										{	
											toastr.error("ERROR: MSG method 'GET' - faild!");
											throw new Error("ERROR: MSG method 'GET' - faild!");
										});
								}
							break;

							case 'POST' :

								$http({	url : msgURL, method : 'POST', data : data})
									.success( dataObj => 
									{	
										deferred.resolve(dataObj);
									})
									.error(err => 
										{	
											toastr.error("ERROR: MSG method 'POST' - faild!");
											throw new Error("ERROR: MSG method 'POST' - faild!" + err);
										});
							break;

							case 'PUT' :

								$http({	url : msgURL + data.id, method : "PUT", data : data})
									.success( dataObj => 
										{
											deferred.resolve(dataObj);
										})
									.error(err => 
										{	
											toastr.error("ERROR: MSG method 'PUT' - faild!");
											throw new Error("ERROR: MSG method 'PUT' - faild!");
										});
							break;

							case 'DELETE' :

								$http({	url :  msgURL + url, method : "DELETE"})
									.success( dataObj => { 
										
											toastr.info('DELETED: ' + url)
										})
									.error(err => 
										{	
											toastr.error("ERROR: MSG method 'DELETE' - faild!");
											throw new Error("ERROR: MSG method 'DELETE' - faild!");
										});
							break;

							default : 
								toastr.error('ERROR: MSG invalid method!');
								throw new Error('ERROR: MSG invalid method!');

							break;
						}
					})
					.catch(err => { $log.warn(err); });				
					return deferred.promise;
				},

				getMSGdata : function()
				{
					return Promise.resolve()
							.then(() => {
								return this._ajaxRequestMSG("GET")
							})
							.catch(err => { 
								$log.warn(err);
								toastr.error('ERROR: MSG "GET" faild');
							});
				},

				postUserMSG : function(msg)
				{
					return Promise.resolve()
							.then(() => {
								if(msg.msgText)
								{
									return this._ajaxRequestMSG("POST", null, msg)
								}
								else {
									throw new Error('MSG is empty');
									return;	
								}
							})
							.catch(err => { 
								$log.warn(err);
								toastr.error('ERROR: MSG "POST" faild. ' + err);
							});
				},

				cleanMSGdb : function(msgQuantityToRemove, msgLimit)
				{	
					var self = this;
					
					return Promise.resolve()
							.then(() => {
									return this._ajaxRequestMSG("GET");
							})
							.then( msgCollection => {
								
								if(msgCollection.length > msgLimit)
								{
									let msgToRemove = [];
									
									for(let i = 0; i < msgQuantityToRemove; i++)
									{
										msgToRemove.push(msgCollection[i].id)
									}
									//toastr.info(msgToRemove);
									return msgToRemove;
								}
								else{ throw new Error("Nothing to clean"); }
							})
							.then(msgToRemove => {

								angular.forEach(msgToRemove, function(id)
								{
									self._ajaxRequestMSG("DELETE", id);
								});
							})
							.catch(err => { 
								$log.warn(err);
								toastr.error('ERROR: MSG DB Clean "DELETE" faild. ' + err);
							});
				}
			};
		}
	);

	return chatServices;
});
