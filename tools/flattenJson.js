var json=require("/Users/JonCooper/Sites/birdlist/tools/freeformatter-out.json");
var birds=[];
var newJson={"version":json.ioclist.version};
//console.log("New Json=",newJson);
var numberOfOrders=json.ioclist.list.order.length===undefined?1:json.ioclist.list.order.length;
for (h=0; h<numberOfOrders; h++){
  var currentOrder=json.ioclist.list.order.length===undefined?json.ioclist.list.order:json.ioclist.list.order[h];
  //var order={"latin_name":currentOrder.latin_name, "code":currentOrder.code, "note":currentOrder.note};
  var order={"code":currentOrder.code};
  //console.log("Order=", order);
  var numberOfFamilies=currentOrder.family.length===undefined?1:currentOrder.family.length;
  for (i=0; i<numberOfFamilies; i++){
    var currentFamily=currentOrder.family.length===undefined?currentOrder.family:currentOrder.family[i];
    //var family={"latin_name":currentFamily.latin_name, "english_name":currentFamily.english_name};
    var family={"english_name":currentFamily.english_name};
    //console.log("Family=", family);
    var numberOfGenus=currentFamily.genus.length===undefined?1:currentFamily.genus.length;
    for (j=0; j<numberOfGenus; j++){
      var currentGenus=currentFamily.genus.length===undefined?currentFamily.genus:currentFamily.genus[j];
      var genus=currentGenus.latin_name;
      //console.log("Genus=", genus);
      var numberOfSpecies=currentGenus.species.length===undefined?1:currentGenus.species.length;
      for (k=0; k<numberOfSpecies; k++){
        var currentSpecies=currentGenus.species.length===undefined?currentGenus.species:currentGenus.species[k];
        var species={"latin_name":currentSpecies.latin_name, "english_name":currentSpecies.english_name, "region":currentSpecies.breeding_regions, "subregion":currentSpecies.breeding_subregions};
        //console.log("Species=", genus, " ", species.latin_name);
        if (currentSpecies.subspecies===undefined){
          birds.push({"order":order, "family":family, "genus":genus, "species":species});
        } else {
          var numberOfSubSpecies=currentSpecies.subspecies.length===undefined?1:currentSpecies.subspecies.length;
          birds.push({"order":order, "family":family, "genus":genus, "species":species});
          for (l=0; l<numberOfSubSpecies; l++){
            var currentSubSpecies=currentSpecies.subspecies.length===undefined?currentSpecies.subspecies:currentSpecies.subspecies[l];
            var subSpecies={"latin_name":currentSubSpecies.latin_name, "subRegions":currentSubSpecies.breeding_subregions}
            birds.push({"order":order, "family":family, "genus":genus, "species":species, "subspecies":subSpecies});

           // console.log("Subspecies=", subSpecies);
          }
        }
      }
    }
  }


}


newJson.birdList=birds;
var fs=require("fs");
fs.writeFile("/Users/JonCooper/Sites/birdlist/tools/iocBirdList.json", JSON.stringify(newJson), "utf8");
//console.log(newJson);

