myBirdList.factory('couchConnection', ['$http', function($http){
  return {
    getBirdList: function() {
      return [{'latin_name':'aves unspecificus unos', 'common_name':'first bird','date':'09-30-2013'}, {'latin_name':'aves unspecificus duos','common_name':'second_bird', 'date':'09-28-2012'}];
    },

    newBirdRecord: function(birdRecord){
       return $http.put("http://localhost:5984/birdlist/" + birdRecord.latin_name, birdRecord)
      .success(function(data, status, headers, config){
        //saved successfully
        console.log(data, " saved");
      })
      .error(function(data, status, headers, config){

        console.log(data, " failed to save");
        console.log("Error message =", status);
        return {"data":data, "status":status, "config":config};
      });

    }
  }

}]);
