var myBirdList=angular.module("birdlist",[]);

var controllers={};

controllers.birdlistCtrl=function($scope){
  $scope.name="birdlistCtrl";
  $scope.title="My Bird List";
};

myBirdList.config(function($routeProvider){

  $routeProvider
    .when("/", {
      controller: controllers.logon,
      templateUrl: 'partials/logon.html'
    });
});

myBirdList.controller(controllers);