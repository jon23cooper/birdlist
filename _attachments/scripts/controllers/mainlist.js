controllers.mainlist=function(couchConnection, $scope){
  $scope.name="mainlist";
  couchConnection.getBirdList()
    .then(function(response){
    	$scope.birdlist=response.data;
    }, function(reason){
      	console.log("Error=",reason);
    });
};

myBirdList.controller(controllers);
