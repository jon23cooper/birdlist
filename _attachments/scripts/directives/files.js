myBirdList.directive('jcFilePicker', function(){
	return function( scope, elem, attrs ) {
    elem.bind('change', function( evt ) {
      scope.$apply(function() {
        scope.fileList=evt.target.files[0];
        scope.$emit("evtCSVFileChanged");
        console.log("File List created");
      });
    });
  };
});

