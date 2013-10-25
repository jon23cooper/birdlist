controllers.main=function($scope, $location, couchConnection){
  $scope.name="Home";
  couchConnection.getBirdList()
  .then(function(response){
    $scope.birdlist=response.data;

  }, function(reason){
    console.log("Error=",reason);
  })

  $scope.year=new Date().getFullYear();
  $scope.filterYear=function(n){
    if (angular.isNumber(n)){
      $scope.year=new Date().getFullYear()-n;
    } else {
      $scope.year="";
    }
  };
};


myBirdList.controller(controllers);
