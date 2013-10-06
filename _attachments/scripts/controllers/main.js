controllers.main=function($scope, couchConnection){
  $scope.name="Home";
  $scope.birdlist=couchConnection.getBirdList();
};