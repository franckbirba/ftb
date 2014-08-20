var express = require('express');
var router = express.Router();
var zlib = require('zlib');
var GridStore = require('mongodb').GridStore;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var im = require('imagemagick');
var multiparty = require('multiparty')
  , http = require('http')
  , util = require('util');
  var crud = require('../lib/crud.js').CRUD;
  var dbClient = new crud();
  
  function gzipEncode(req, res, obj, head, code, json, format){
      if(!json && json != false) json = true;
      if(!code) code = 200;
      if(!head) head = 'application/javascript';

      res.writeHead(code, {'Content-Type': head, 'Content-Encoding': 'gzip'});
      if (json){
          zlib.gzip(JSON.stringify(obj), function (_, result) {  // The callback will give you the 
              res.end(result);                     // result, so just send it.
          });
      } else {
          zlib.gzip(obj, function (_, result) {  // The callback will give you the 
              res.end(result, 'binary');                     // result, so just send it.
          });
      }
    
  }
  
  function writeCallback(dbClient, tmpFileName, tmpFullName, img, callback){
      console.log('WRITING', tmpFileName, tmpFullName);
      var gridStore = new GridStore(dbClient.db, tmpFileName, tmpFullName, 'w');
      gridStore.open(function(err, gridStore) {
          gridStore.write(new Buffer(img), function(err, gridStore) {
              gridStore.close(function(err, fileData) {
                  console.log("FILE wrote", fileData);
                  callback(err, fileData);
              });
          });
      });
  };

  var IMG = function(){
      
  };
  IMG.prototype.get = function(req, res){
      console.log(req.query, req.body, req.params);
      var fileIndex = "doggy";
      if(Object.keys(req.query).length <= 0){
          var gridStore= GridStore(dbClient.db, fileIndex, 'r');
          var doggies = [];
          GridStore.list(dbClient.db,{id:true}, function(err,items){
              console.log(items);
              items.forEach(function(filename){
                  doggies.push({url: "http://localhost:4242/img?id="+filename})
                  console.log(filename);
              })
             gzipEncode(req, res, doggies, "text/javascript", 200);
          });
      } else {
          var fileName = req.query.id;
          var width = req.query.width;
          var height = req.query.height;
          var crop = req.query.crop;
          var fileIndex = /*"doggy"+"_"+*/fileName;
          var gridStore= GridStore(dbClient.db, new ObjectId(fileIndex), 'r');
          gridStore.open(function(err, gridStore){
              if(err){
                  gzipEncode(req, res, {error:err.toString()}, null, 500);
                  return;
              }

              var stream =  gridStore.stream(true);
              stream.on("end", function(err){
                  fs.readFile('./fileUpload/tmp_'+fileIndex+'.tmp', function(err, streamedData) {
                      gridStore.close();
                      var opt = {
                          srcPath: './fileUpload/tmp_'+fileIndex+'.tmp',
                          dstPath: './fileUpload/tmp_'+fileIndex+'_resize.tmp'
                      };
                      if(width)
                      opt['width'] = width;
                      if(height)
                      opt['height'] = height;
                    
                      if(width || height) {
                          if(crop){
                              var possibleCrop = ["northwest", "north", "northeast", "west", "center", "east", "southwest", "south", "southeast"];
                              opt['gravity'] = possibleCrop.indexOf(crop) >= 0 ? crop : 'center';
                              opt['quality'] = 1;
                              im.crop(
                                  opt
                                  , function(err, stdout, stderr){
                                      if (err) throw err;
                                      fs.readFile('./fileUpload/tmp_'+fileIndex+'_resize.tmp', function(err, streamedData) {
                                          gzipEncode(req, res, streamedData, 'image/png', 200, false);
                                      });
                                  });
                              } else {
                                  im.resize(
                                      opt
                                      , function(err, stdout, stderr){
                                          if (err) throw err;
                                          fs.readFile('./fileUpload/tmp_'+fileIndex+'_resize.tmp', function(err, streamedData) {
                                              gzipEncode(req, res, streamedData, 'image/png', 200, false);
                                          });
                                      });
                                  }
                              }
                              else {
                                  gzipEncode(req, res, streamedData, 'image/png', 200, false);
                              }

                          });
                      });
                      var fileStream = fs.createWriteStream('./fileUpload/tmp_'+fileIndex+'.tmp');
                      // Pipe out the data
                      stream.pipe(fileStream);
              });
          
      }
      
      
  };
  IMG.prototype.post = function(files, res){
      var fileCpt = 0;
      for(file in files){
          var tmpFile = files[file][0];
          console.log(tmpFile, tmpFile.headers);
          var img = fs.readFileSync(tmpFile.path);
          var ext = tmpFile.originalFilename.substr(tmpFile.originalFilename.lastIndexOf("."));

          var tmpFileName = "doggy"+"_"+tmpFile.originalFilename;
          console.log(tmpFileName, img);

          writeCallback(dbClient, new ObjectId(), tmpFileName, img, function(err, fileData){
              fileCpt++;
              if(fileCpt == Object.keys(files).length){
                  if(err)
                  res.send(500, err);
                  else
                  res.send(200);
              }
          })
      }
  };
  
  var iFactory = new IMG();

        /* GET home page. */
        router.get('/', function(req, res) {
            iFactory.get(req, res);
        });

        router.post('/', function(req, res) {
            var form = new multiparty.Form();

            form.parse(req, function(err, fields, files) {
                iFactory.post(files, res);
            });
        });


        module.exports = router;
