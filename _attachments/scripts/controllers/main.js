controllers.main=function($scope, $location, couchConnection){
  $scope.name="Home";
  $scope.birdlist=couchConnection.getBirdList();
  $scope.year=new Date().getFullYear();
  $scope.filterYear=function(n){
    if (angular.isNumber(n)){
      $scope.year=new Date().getFullYear()-n;
    } else {
      $scope.year="";
    }

  };


};