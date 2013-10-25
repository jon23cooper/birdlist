myBirdList.factory('couchConnection', ['$http', '$timeout', function($http, $timeout){
  return {
    getBirdList: function() {
      return $http.get("http://localhost:5984/birdlist/_design/birdlist/_view/all_birds")
      .success(function(response){
        return response.data;
      })
      .error(function(reason){
        return reason;
      })
    },

    newBirdRecord: function(birdRecord){
      return $timeout( function(){
        return $http.put("http://localhost:5984/birdlist/" + birdRecord.latin_name, birdRecord)
      .success(function(data, status, headers, config){
        //saved successfully
        return {"data":data, "status":status, "config":config};
      })
      .error(function(data, status, headers, config){

        console.log(data, " failed to save");
        console.log("Error message =", status);
        return {"data":data, "status":status, "config":config};
      });
      }, 10);
    },

    compact: function(){
      return $http.post("http://localhost:5984/birdlist/_compact","",{"headers":{"Content-Type": "application/json"}}).
      then(function(code){
        return code;
      });

    },

    forceUpload: function(birdRecord){
      //need to overwrite existing attributes with new properties
      $http.get("http://localhost:5984/birdist/" + birdRecord.latin_name)
      .then(function(data, status, headers, config){
        for (var propertyName in birdRecord){
            data[propertyName]=birdRecord[propertyName];
        }
        return $http.put("http://localhost:5984/birdlist/" + birdRecord.latin_name, data);
      })
      .error(function(data, status, headers, config){
        return (status, data);
      });

    }

  }}]);
