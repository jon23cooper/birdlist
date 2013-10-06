myBirdList.factory('couchConnection', ['$http', function(){
  return {
    getBirdList: function() {
      return [{'latin_name':'aves unspecificus unos', 'common_name':'first bird','date':'30/09/2013'}, {'latin_name':'aves unspecificus duos','common_name':'second_bird', 'date':'30/09/2012'}];
    }
  }

}]);
