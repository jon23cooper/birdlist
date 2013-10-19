var myBirdList=angular.module("birdlist",['ngRoute', 'ui.bootstrap']);

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
    })
    .when("/main",{
      controller:controllers.main,
      templateUrl:'partials/main.html'
    })
    .when("/admin",{
      controller:controllers.admin,
      templateUrl:'partials/admin.html'
    })
    .when("/create",{
      controller:controllers.loadCSV,
      templateUrl:'partials/loadcsv.html'
    });
});

myBirdList.controller(controllers);
