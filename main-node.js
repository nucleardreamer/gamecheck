var phantom = require('node-phantom'),
    req = require('request'),
    fs = require('fs'),
    moment = require('moment'),
    bigData;

console.log('init');


var main = {

    json: null,
    
    queue: [],
    
    runQueue: function(){
      var _this = this;
      var ind = 0;
      
      var int = setInterval(function(){
        console.log(Math.floor(ind / _this.queue.length)+'%');
        if(ind < _this.queue.length){
          _this.getGame(_this.queue[ind][0],_this.queue[ind][1],_this.queue[ind][2],function(ret,worked){
              //console.log(ret);
              if(worked){
                fs.appendFile('data/all.json', JSON.stringify(ret)+',', function (err) {
                  if (err) throw err;
                  
                });
              } else {
                
                fs.appendFile('data/all_failed.json', JSON.stringify(ret)+',', function (err) {
                  if (err) throw err;
                  
                });
              }
              
          });
          
        }
        ind++;
        
        
/*
        _this.getGame(cons,data[cons][game].safename,game,function(ret,worked){
            if(worked){
              fs.appendFile('data/all.json', JSON.stringify(ret)+',', function (err) {
                if (err) throw err;
                
              });
            } else {
              
              fs.appendFile('data/all_failed.json', JSON.stringify(ret)+',', function (err) {
                if (err) throw err;
                
              });
            }
            
            ind++;
            
        });
*/
        
      },3000);      
    },
    
    init: function(){
    
      var _this = this;
      
      fs.readFile('console_obj.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var data = JSON.parse(data);
        _this.json = data;
        
        for( cons in data ){
          
          for( game in data[cons]){

            
              _this.queue.push([cons,data[cons][game].safename,game]);

          }
          
        }
        _this.runQueue();
        
       /*
 _this.getGame('nes','10-yard-fight',0,function(ret,worked){
          if(worked){
            fs.appendFile('data/all.json', JSON.stringify(ret)+',', function (err) {
              if (err) throw err;
              
            });
          } else {
            
            fs.appendFile('data/all_failed.json', JSON.stringify(ret)+',', function (err) {
              if (err) throw err;
              
            });
          }
        });
        
      
*/
      });
    },
    
    log: function(item){
      
      console.dir(item);
      
    },
    
    getGame: function(cons, safename, gameIndex, cb){
      var _this = this;
      var url = 'http://videogames.pricecharting.com/game/'+cons+'/'+safename;
      _this.log(url);
      
      var obj = _this.json[cons][gameIndex];
      
      obj.console = cons;
      
      //console.log(obj);
      
      setTimeout(function(){
      
      phantom.create(function(e,ph) {
        ph.createPage(function(e,page) {
          //pjs api methods
          
          page.open(url,function(e,status) {
              
              
              page.includeJs('http://cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.2/moment.min.js', function(err) {

  
                setTimeout(function() {
                  
                  
                
                  return page.evaluate(function() {
                    
                    function ___clean(actual){
                      var newArray = new Array();
                      for(var i = 0; i<actual.length; i++){
                    	  if (actual[i]){
                    		  newArray.push(actual[i]);
                    		}
                      }
                      return newArray;
                    }

                    
                    var ___el = $('#product_details');
                    
                    var ___upc = ___el.find('p').clone().find('span').remove().end().text().replace(/\n/g,'').split(' ');
                    
                    var ___date = ___el.find('.date').text();
                    
                    
                    return {
                      img: ___el.find('.cover img').attr('src'),
                      upc: ___clean(___upc)[0],
                      date: ___date
                    };
                  
                  }, function(err,result) {
                    //console.log(result);
                    if(result !== null){
                      obj.img = result.img;
                      obj.upc = result.upc;
                      obj.date = (result.date) ? moment(result.date,'D MMM YYYY').unix() : '';
                      console.log(cons + ': ' + gameIndex + ' of ' + _this.json[cons].length);
                      if(cb)cb(obj, true);
                    } else {
                      if(cb)cb(obj, false);
                    }
                    ph.exit();
                  });
                  
              }, 10);

              });           
                       
          });
          
        });
      });  
      },4000)
    }
  
}

main.init();

/*
req.get('./console_obj.json',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
    }
  }
);
*/

