controllers.loadCSV=function($scope, couchConnection){
  $scope.name="create";
  $scope.progress=0;
  $scope.panels={};

  $scope.$on('evtCSVFileChanged', function(){
    if ($scope.fileList.type!="text/csv"){
       // alert("Wrong file Type");

      } else {
       // alert("Right File Type");
        console.log($scope.fileList);
        $scope.birdList=[];
        $scope.r=new FileReader();

       $scope.r.readAsText($scope.fileList, "utf-8");

      }
  });

 $scope.$watch('r', function(){
   if ($scope.r!==undefined){
     $scope.r.onloadend=function(e){
       console.log("Load end");
       $scope.lineArray=$scope.r.result.split("\n");
       if ($scope.validateCsv($scope.lineArray[0])){
         $scope.parse();
       }

     };
   }
 });

  $scope.split=function(csvString){
    var i=0;
    var quotesFound=0;
    var atEndOfField=false;
    while(!atEndOfField){
      if (csvString.charAt(i)==='"'){
        quotesFound++;
      } else {
        if (csvString.charAt(i)===","){
          if (quotesFound%2===0){
            atEndOfField=true;
          }
        } else if (i>csvString.length){
          atEndOfField=true;
        }
      }
      i++;
    }//end while
    //field stretches from charAt(0) to charAt(i-1)
    return [csvString.substr(0, i-1), i];

  };

 $scope.parse=function(){
   $scope.logs=[{"class":"warning", "type":"Warning", "items":[]}, {"class":"danger", "type":"Error", "items":[]}];
   $scope.uploaded={"success":0, "warning":0, "error":0};
   $scope.currentRecord=1;
   //$scope.numberOfSpecies=$scope.lineArray.length;
   $scope.numberOfSpecies=300;
   var currentSpecies_englishName;
   //while (i<$scope.lineArray.length){
   while ($scope.currentRecord<300){
     var data=[];
     line=$scope.lineArray[$scope.currentRecord];
     while (line.length>0){
        var fieldValue=$scope.split(line)
        data.push(fieldValue[0]);
        line=line.slice(fieldValue[1]);
        //console.log(data);
        //console.log("line=", line , "line length=", line.length)
      } // end while

     switch (data[3]){
        case "species":
          currentSpecies_englishName=data[5];
          $scope.save({"type":"bird","category":data[3], "latin_name":data[4], "english_name":data[5], "range":data[6], "order":data[7], "family":data[8], "extinct":data[9] });
          break;
        case "group (polytypic)":
         //just need english name for group
          currentSpecies_englishName=data[5];
         $scope.numberOfSpecies--;
          break;
        case "group (monotypic)":
          $scope.save({"type":"bird","category":"subspecies", "latin_name":data[4], "english_name":data[5], "range":data[6], "order":data[7], "family":data[8], "extinct":data[9]});
          break;
        case "subspecies":
          $scope.save({"type":"bird", "category":"subspecies", "latin_name": data[4], "english_name":currentSpecies_englishName, "range":data[6], "order":data[7], "family":data[8], "extinct":data[9]});
          break;
       default:
         console.log("No category match Error:");
         console.log("field 0: ", data[0]);
         console.log("field 1: ",data[1]);
         console.log("field 2: ", data[2]);
         console.log("No match for ", data[3]);
         console.log("field 4: ", data[4]);
         $scope.uploaded.error++;
         $scope.percentError=$scope.uploaded.error*100/$scope.numberOfSpecies;
         $scope.log.errors.push(data);
     }//end switch
     $scope.currentRecord++;
   }//end while
   console.log("Job Done");
   $scope.$apply();
 };

 $scope.save=function(bird){
   couchConnection.newBirdRecord(bird)
   .then (function(){
     $scope.uploaded.success++;
     $scope.percentSuccess=$scope.uploaded.success*100/$scope.numberOfSpecies;
   }
   , function(warning){
     $scope.uploaded.warning++;
     $scope.percentWarning=$scope.uploaded.warning*100/$scope.numberOfSpecies;
     addWarningType=function(myType){
       console.log("checking warning types", myType, " against ", $scope.warningTypes );
       if ($scope.warningTypes===undefined){
         $scope.warningTypes={};
         $scope.warningTypes[myType]=myType;
       } else {
         if (!$scope.warningTypes.hasOwnProperty(myType)) {
           $scope.warningTypes[myType]=myType;
         }
       }
     };
     addWarningType(warning.data.error);
     $scope.logs[0].items.push({"error":warning.data.error, "item":warning.config.data});
   }
   );


 };

  $scope.collapse=function(panelName){
    if ($scope.panels.hasOwnProperty(panelName)){
      $scope.panels[panelName]=!$scope.panels[panelName];
    } else {
      $scope.panels[panelName]=true;
    }
    console.log("Scope Panels ",$scope.panels);
  };

 $scope.validateCsv=function(header){
   var columnHeaders=header.split(",");
   var valid=false;
   valid=columnHeaders[0].indexOf("Clements")===0;
   valid=valid && columnHeaders[3].indexOf("Category")===0;
   valid=valid && columnHeaders[4].indexOf("Scientific name")===0;
   valid=valid && columnHeaders[5].indexOf("English name")===0;
   valid=valid && columnHeaders[6].indexOf("Range")===0;
   valid=valid && columnHeaders[7].indexOf("Order")===0;
   valid=valid && columnHeaders[8].indexOf("Family")===0;
   return valid;
 };

 $scope.isSpecies=function(bird){
   return bird.category==="species";
 };
};


myBirdList.controller(controllers);
