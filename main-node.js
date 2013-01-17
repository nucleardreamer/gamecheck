var phantom = require('node-phantom');
phantom.create(function(e,ph) {
  return ph.createPage(function(e,page) {
    //From here on in, we can use PhantomJS' API methods
    
    return page.open("http://tilomitra.com/repository/screenscrape/ajax.html",
        function(e,status) {
            //The page is now open
            console.log("opened site? ", status);
        });
    });
});