var yql = require('yql'),
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
        console.log(Math.round(Math.floor(ind / _this.queue.length)) + '%: ' + ind + ' of ' + _this.queue.length);
        if(ind < _this.queue.length){
          _this.getGame(_this.queue[ind][0],_this.queue[ind][1],_this.queue[ind][2],function(ret,which){
              //console.log(ret);
            if(which){ 
               fs.appendFile('data/all.json', JSON.stringify(ret)+',', function (err) {
                  if (err) throw err;
                });
            } else {
                fs.appendFile('data/all.json', JSON.stringify(ret)+',', function (err) {
                  if (err) throw err;
                });
               fs.appendFile('data/all_failed.json', JSON.stringify(ret)+',', function (err) {
                  if (err) throw err;
                }); 
            }
          });
          
        }
        ind++;
      },250);      
    },
    
    init: function(){
    
      var _this = this;
      
      fs.readFile('console_obj.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        data = JSON.parse(data);
        _this.json = data;
        
        for( cons in data ){
            for( game in data[cons]){
              _this.queue.push([cons,data[cons][game].safename,game]);
          }
        }
        _this.runQueue();
        
      });
    },
    
    log: function(item){
      
      console.dir(item);
      
    },
    
    getGame: function(cons, safename, gameIndex, cb){
        var _this = this;
        var url = 'http://videogames.pricecharting.com/game/'+cons+'/'+safename;
        
        
        
        var obj = _this.json[cons][gameIndex];
        
        obj.console = cons;
                         
        new yql.exec('select * from html where url="http://videogames.pricecharting.com/game/'+cons+'/'+safename+'" and xpath=\'//div[@id="product_details"]/div[1]/img[1] | //div[@id="product_details"]/p[1]/span[@class="date"] | //div[@id="product_details"]/p[1]/text()[1] | //div[@id="product_details"]/p[1]/a[@href]\'', function(r){
            var result = r.query.results;
            if(result){
                obj.img = (result.img !== null) ? result.img.src.toString() : '';
                obj.upc = result.content || '';
                obj.date = (result.span) ? moment(result.span.content,'D MMM YYYY').unix().toString() : '';
                obj.more = (result.a) ? result.a.href : '';
                //console.dir(obj);
                _this.log(url);
                cb(obj, true);
            } else {
                
                cb(obj, false);
            }
        });
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

