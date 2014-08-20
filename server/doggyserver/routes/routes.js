var crud = require('../lib/crud.js').CRUD;
var dbClient = new crud();
var zlib = require('zlib');
var GridStore = require('mongodb').GridStore;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var im = require('imagemagick');

var passport = require('passport');

var fileSystem = require('fs'),
path = require('path'),
login = require('connect-ensure-login');

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

/*
* GET home page.
*/
exports.eventApi = [
function(req, res) {
    var method = req.route.method;
    var gzipAnswer = req.query.gzip;
    delete req.query.gzip;

    var body = req.query.body;
    if(!body.title || !body.begin || !body.end ){
        res.send(400, 'incomplete request');
        return;
    }


}
];

exports.index = function(req, res){
    res.render('index', { title: 'UBQT api v0.1' });
};

exports.login = function(req, res){
    res.render('login', { title: 'UBQT api v0.1' });
};

function writeCallback(dbClient, tmpFileName, tmpFullName, img, callback){
    console.log('WRITING', tmpFileName, tmpFullName);
    var gridStore = new GridStore(dbClient.db, tmpFileName/*, tmpFullName*/, 'w');
    gridStore.open(function(err, gridStore) {
        gridStore.write(new Buffer(img), function(err, gridStore) {
            gridStore.close(function(err, fileData) {
                console.log("FILE wrote", fileData);
                callback(err, fileData);
            });
        });
    });
};

exports.images = function(req, res){
    var method = req.route.method;
    if (method == 'get'){
        var width = req.query.width;
        var height = req.query.height;
        var crop = req.query.crop;
        var tmpFileName = req.query.filename;
        var fileIndex = req.query.event+"_"+tmpFileName;
        var gridStore= GridStore(dbClient.db, fileIndex, 'r');
        GridStore.list(dbClient.db,{id:true}, function(err,items){
            items.forEach(function(filename){
                console.log(filename);
            })
        });
        
        gridStore.open(function(err, gridStore){
            if(err){
                gzipEncode(req, res, {error:err.toString()}, null, 500);
                return;
            }

            var stream =  gridStore.stream(true);
            stream.on("end", function(err){
                fs.readFile('./fileTmp/tmp_'+fileIndex+'.tmp', function(err, streamedData) {
                    gridStore.close();
                    var opt = {
                        srcPath: './fileTmp/tmp_'+fileIndex+'.tmp',
                        dstPath: './fileTmp/tmp_'+fileIndex+'_resize.tmp'
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
                                    fs.readFile('./fileTmp/tmp_'+fileIndex+'_resize.tmp', function(err, streamedData) {
                                        gzipEncode(req, res, streamedData, 'image/png', 200, false);
                                    });
                                });
                        } else {
                            im.resize(
                                opt
                                , function(err, stdout, stderr){
                                    if (err) throw err;
                                    fs.readFile('./fileTmp/tmp_'+fileIndex+'_resize.tmp', function(err, streamedData) {
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
var fileStream = fs.createWriteStream('./fileTmp/tmp_'+fileIndex+'.tmp');
                    // Pipe out the data
                    stream.pipe(fileStream);
                });
} else {
    if (req.files)
        var fileCpt = 0;
    for(file in req.files){
        var tmpFile = req.files[file];
        var img = fs.readFileSync(tmpFile.path);
        var ext = tmpFile.name.substr(tmpFile.name.lastIndexOf("."));

        var tmpFileName = req.body.event+"_"+file;
        console.log(tmpFileName, img);

        writeCallback(dbClient, tmpFileName,tmpFileName, img, function(err, fileData){
            fileCpt++;
            if(fileCpt == Object.keys(req.files).length){
                if(err)
                    res.send(500, err);
                else
                    res.send(200);
            }
        })

                   /* var gridStore = new GridStore(dbClient.db, tmpFileName, tmpFileName+ext, 'w');
                    gridStore.open(function(err, gridStore) {
                        gridStore.write(new Buffer(img), function(err, gridStore) {
                            gridStore.close(function(err, fileData) {
                                console.log("FILE wrote", fileCpt, fileData);
                                
                                
                            });
                        });
});*/
    }
}
};

exports.crud = [
    passport.authenticate('bearer', {session:false}),
    // login.ensureLoggedIn(),
    function(req, res) {
        console.log('CRUD ROUTE');
        // passport.authenticate('bearer',{session:false});
        var method = req.route.method;
        var collection = req.params.collection;
        if(req.query.access_token)
            delete req.query.access_token
        dbClient[method](collection, {body: req.body, query: req.query, params: req.params, files: req.files}, function(err, results) {
            if(err)
                res.send(500,err);
            else
                gzipEncode(req,res, results);
        });
    }
];


exports.public = [
    function(req, res) {

        var method = req.route.method;
        var collection = req.params.collection;
        var gzipAnswer = req.query.gzip;
        delete req.query.gzip;
        if(collection == "users"){
            res.send(401);
            return;
        }
        dbClient['get'](collection, {query: req.query, params: req.params}, function(err, results) {
            if(err)
                res.send(500,err);
            else{
                if(gzipAnswer && gzipAnswer != 'false')
                    gzipEncode(req,res, results);
                else
                    res.send(200,results);
            }
        });
    }
];

exports.api = function(req, res) {
    var filePath = path.join(__dirname, 'public/api/api.js');
    var stat = fileSystem.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'file/javascript',
        'Content-Length': stat.size
    });
    
    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
};