//clear existing class="active" tag then set class="active" for clicked tag
myBirdList.directive('jcTabClick', function(){
  return{
    link: function(scope, elem, attr){
      var tab=angular.element(elem);
      tab.on('click', function(){
        var tabSet=tab.parent().parent();
        //remove active class from currently active tab
        tabSet.children(".active").removeClass("active");
        //add active class to clicked tab
        tab.parent().addClass("active");
      })

    }
  }
});
