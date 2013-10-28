var myBirdList=angular.module("birdlist",['ngRoute', 'ui.bootstrap', 'infinite-scroll']);

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
    .when("/lists",{
      controller:controllers.lists,
      templateUrl:'partials/lists.html'
    })
    .when("/create",{
      controller:controllers.loadCSV,
      templateUrl:'partials/loadcsv.html'
    });
});

myBirdList.controller(controllers);
