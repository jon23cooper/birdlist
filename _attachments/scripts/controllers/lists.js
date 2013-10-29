controllers.lists=function($scope, couchConnection){
  $scope.name="lists";

  $scope.loadMore=function(){
    if ($scope.limit===undefined){
      $scope.limit=25;
    } else {
      $scope.limit++;
    }
  };

  couchConnection.getBirdList()
  .then(function(response){
    console.log(response.data.rows);
    $scope.birdlist=response.data;

  }, function(reason){
    console.log("Error=",reason);
  });

};

myBirdList.controller(controllers);
