

controllers.loadCSV=function($scope, couchConnection){

  //log is an object with structure:
  // {title:String, class: String, errorTypes:ArrayOfString, errorArray:ArrayOfErrorObjects}
  //errorObject has Structure:
  //{type:String, "birds":ArrayOfBirdObjects}
  log=function(title, myClass){
  this.title=title;
  this.class=myClass;
  this.errorTypes=[];
  this.errorArray=[];
  this.add=function(data){
    if (!this.hasErrorType(data.error)){
      this.errorTypes.push(data.error);
      this.errorArray.push({"type":data.error, "birds":[data.item]});
    } else {
      var errorArrayItem=this.getErrorArrayItem(data.error);
      console.log("errorArrayItem=", errorArrayItem);
      if (errorArrayItem!==undefined){
        errorArrayItem.birds.push(data.item);
      } else {
        console.log("Still need to add: ", data.item);
      }
    }
  };

  this.getErrorArrayItem=function(type){
    var item;
    angular.forEach(this.errorArray, function(value, key){
      if (value.type===type){
        item=value;
      }
    });
    console.log("Returning ", item);
    return item;
  };

  this.hasErrorType=function(type){
    var found=false;
    angular.forEach(this.errorTypes, function(value, key){
      if (value===type){
        found=true;
      }
    });
    return found;
  };

  this.count=function(errorType){
    console.log("counting ErrorTYpes that match:  ", errorType);
    var total=0;
    angular.forEach(this.errorTypes, function(value, key){
      if (errorType===undefined || errorType===value){
        total+=this.getErrorArrayItem(value).birds.length;
      }
    }, this);
    return total;
  };

};


  $scope.name="create";
  $scope.progress=0;
  $scope.panels={};
  $scope.warningLog=new log("Warning", "warning");
  $scope.errorLog= new log("Error", "danger");
  $scope.successLog = new log("Success", "success")

  $scope.$on('evtCSVFileChanged', function(){
    if ($scope.fileList.type!="text/csv"){
       // alert("Wrong file Type");

      } else {
       // alert("Right File Type");
        $scope.birdList=[];
        $scope.r=new FileReader();
        $scope.r.readAsText($scope.fileList, "utf-8");
      }
  });

 $scope.$watch('r', function(){
   if ($scope.r!==undefined){
     $scope.r.onloadend=function(e){
       console.log("Load end");
       $scope.lineArray=$scope.r.result.split("\r\n");
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

   $scope.uploaded={"success":0, "warning":0, "error":0};
   $scope.currentRecord=6060;
   $scope.numberOfSpecies=9;
   var currentSpecies_englishName;
   while ($scope.currentRecord<6070){
     var data=[];
     line=$scope.lineArray[$scope.currentRecord];
    // console.log("current Record = ", line);
     while (line.length>0){
        var fieldValue=$scope.split(line)
        data.push(fieldValue[0]);
        line=line.slice(fieldValue[1]);
        //console.log("parsed data = ", data);
       // console.log("line=", line , "line length=", line.length)
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
         $scope.errorLog.add({"error":"No category match", "item":data});
         break;
     }//end switch
     $scope.currentRecord++;
   }//end while
   console.log("Job Done");
   couchConnection.compact().then (function(code){
     console.log("Compaction code=", code)},
        function(code){console.log("Compaction error code=", code)});
   $scope.$apply();
 };

 $scope.save=function(bird){
   couchConnection.newBirdRecord(bird)
   .then (function(data){
     console.log("success returns: ", data);
     $scope.uploaded.success++;
     $scope.percentSuccess=$scope.uploaded.success*100/$scope.numberOfSpecies;

     $scope.successLog.add({"error":"Successful", "item":data.data.id});
   }
   , function(warning){
     $scope.uploaded.warning++;
     $scope.percentWarning=$scope.uploaded.warning*100/$scope.numberOfSpecies;
     $scope.warningLog.add({"error":warning.data.error, "item":warning.config.data});
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

 $scope.close=function(myClass, myErrorType){
   if ($scope.panels.hasOwnProperty(myClass + "_" + myErrorType)){
     $scope.panels[myClass + "_" + myErrorType]=!$scope.panels[myClass + "_" + myErrorType];

   } else {
     $scope.panels[myClass + "_" + myErrorType]=true;
   }
   console.log("Panels collection=",$scope.panels);
 };

  $scope.forceUpload=function(data){
    couchConnection.forceUpload(data)
    .then(function(){
      $scope.uploaded.success++;
      $scope.percentSuccess=$scope.uploaded.success*100/$scope.numberOfSpecies;
    },
    function(){
      //failed
    })
  };

};


myBirdList.controller(controllers);
