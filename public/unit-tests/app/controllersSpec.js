define(["angular","angularMock", "app","services"], function(angular) {

    describe("Controller test // ", function () {
        var $controller;
        var $scope;
        var createController;
        var $location;
        var $httpBackend;

        beforeEach(module("chatApp"));

        beforeEach(inject(function ($injector) {

            $controller = $injector.get('$controller');
            $scope = $injector.get('$rootScope');
            $location = $injector.get('$location');
            $httpBackend = $injector.get('$httpBackend');

            createController = function() {
                return $controller('chatAppCtrl', {'$scope' : $scope });
            };

            reqHandler = $httpBackend.when('GET', 'http://localhost:2403/items/')
                .respond(
                    [
                        {
                            "id": "1",
                            "name": "Alex",
                            "password": 4,
                            "loginStatus": false,
                            "loginDate": 50000,
                            "registerDate": 1000
                        },
                        {
                            "id": "2",
                            "name": "Stas",
                            "password": 4,
                            "loginStatus": false,
                            "loginDate": 500000,
                            "registerDate": 10000
                        },
                    ]
                );
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

// Default Vars *START*
        it("default vars", function ()
        {
            createController();
            expect($scope.currentView).toEqual("login");
            expect($scope.usersDB).toEqual([]);
            expect($scope.loggedUser).toEqual(Object.create(null));
            expect($scope.msgList).toEqual([]);
            expect($scope.msgTo).toEqual(null);
        });
// Default Vars *END*

// View Control *START*
        it("View control fn: GENERAL", function ()
        {   createController();
            var view = 'test';
            spyOn($location, 'path');
            $scope.view.changeView(view);

            expect($scope.currentView).toEqual('test');
            expect($location.path).toHaveBeenCalledWith('/test');
        });

        it("View control fn: IF 'chat' ", function ()
        {   createController();
            var view = 'chat';
            spyOn($location, 'path');
            //spyOn($scope.update());
            $scope.view.changeView(view);


            expect($scope.currentView).toEqual('chat');
            expect($location.path).toHaveBeenCalledWith('/chat');

            //expect($scope.update()).toHaveBeenCalled();

        });
// View Control *END*

//Update Fn *START*
        it("Update fn: GENERAL", function ()
        {   createController();
            $scope.loggedUser.id = "1";
            $scope.update();
            $httpBackend.flush();


            expect($scope.usersDB.length).toEqual(2);
            expect($scope.usersDB[1].name).toEqual('Stas');

        });

//Update Fn *END*









    });

}); // describe END


// });