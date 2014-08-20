var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var config = require('./config.js');
var GridStore = require('mongodb').GridStore;
var fs = require('fs');
var im = require('imagemagick');
var bcrypt = require('bcrypt');
var collection_config = require('./collection_config').collection_config;

exports.CRUD = function(callback) {
    var me = this;
    
    var db = config.get('db');
    var port = config.get('port');
    var host = config.get('host');
    
    me.connectionString = 'mongodb://' + host + ':' + port + '/' + db;
    me.initDb(function() {
        console.log("connected to " + me.connectionString);
        collection_config.initIndexes(me.db, callback);
    });
};

exports.CRUD.prototype.initDb = function(callback) {
    var me = this
    MongoClient.connect(me.connectionString, {
        db: {
            forceServerObjectId: true,
            numberOfRetries: 10,
            retryMiliSeconds: 1000
        },
        server: {
            auto_reconnect: true,
            poolSize: 10,
            socketOptions:{
                keepAlive: 1
            }
        }
    }, function(err, db) {
	if (err)
	    console.log('ERROR', err);
        me.db = db;
        callback();
    });
};

exports.CRUD.prototype.get = function(collection, query, callback) {
    var pageSize = query.query['$limit'] ? parseInt(query.query['$limit']) : 20;
    var pageNumber = query.query['$page'] ? parseInt(query.query['$page']) : 1;
    var sortQuery = query.query['$sort'] ?  JSON.parse(query.query['$sort']) : {};
    var skip = query.query['$skip'] ? query.query['$skip'] : pageSize * (pageNumber - 1);
    var id = query.query._id;

    if (id != undefined && id && (id.length == 12 || id.length == 24)) {
        query.query._id = new ObjectId(query.query._id);
    }
    if(skip) {
        delete(query.query['$skip']);
    }
    if(pageSize)
	delete(query.query['$limit']);
    if(pageNumber)
	delete(query.query['$page']);
    if(sortQuery)
	delete(query.query['$sort']);
    if(query.query.deleted)
	query.query.deleted = query.query.deleted === "true";
    if(query.query.retweetedBool)
	query.query.retweetedBool = query.query.retweetedBool === "true";
    var me = this;
    // console.log('GETTING', query.query);
   // console.log('DB', me.db);
    collection_config.getFormat(collection, 'get', query.query, function(obj, err) {
        var results = [];
        var errors = [];
        var stream = me.db.collection(collection).find(obj).sort(sortQuery).skip(skip).limit(pageSize).stream();
        stream.on('data', function(data) {
            results.push(data);
        }).on('close', function() {
            if (errors.length <= 0)
		errors = null;
            callback(errors, results);
        }).on('error', function(err) {
            errors.push(err);
        });
    });
};

exports.CRUD.prototype.put = function(collection, query, callback){
    var tmp = query.body;
    var tmpId;
    if (tmp._id != null && (tmp._id.length == 12 || tmp._id.length == 24))
        tmpId = query.body._id ? new ObjectId(query.body._id) : null;
    else
        tmpId = query.body._id;
    
    if(tmp.password) {
        tmp.password = bcrypt.hashSync(tmp.password, 10);
    }
    delete tmp._id;
    
    var me = this;
    var saveCallback = function(callback, err){
        if(err)
            callback(err, null);

        collection_config.getFormat(collection, 'put', query.body, function(obj, err) {
            me.db.collection(collection).update({_id:tmpId}, {$set:obj}, {safe: true}, function(err, items) {
                callback(err, items);
            });
        });

        /*
          me.db.collection(collection).update({_id:tmpId}, {$set:tmp},{safe: true}, function(err, items) {
          callback(err, items);
          });
        */
    }
    
    if (query.files && Object.keys(query.files).length >= 1) {
        var cpt =0,
        len = Object.keys(query.files).length;
        
        for (fileIndex in query.files){
            var tmpFile = query.files[fileIndex];
            console.log(tmpFile.fieldName+'_'+id);
            var img = fs.readFileSync(tmpFile.path);
            var gridStore = new GridStore(me.db, tmpFile.fieldName+'_'+id,'w');
            gridStore.open(function(err, gridStore) {
                console.log("ERR",err);
                gridStore.write(new Buffer(img), function(err, gridStore) {
                    console.log(gridStore.fileId, gridStore.filename);
                    gridStore.close(function(err, fileData) {
                        cpt++;
                        if (cpt == len) {
                            saveCallback(callback, err);
                        }
                    });
                });
            });
        }
    } else {
        saveCallback(callback);
    }
    
    /*
      this.db.collection(collection).save(tmp, {safe: true}, function(err, items) {
      callback(err, items);
      });
    */
};

exports.CRUD.prototype.delete = function(collection, query, callback){
    var id;
    if (query.query._id != null && query.query._id.length != 12 && query.query._id.length != 24)
        id = query.query._id;
    else
        var id = new ObjectId(query.query._id);

    this.db.collection(collection).remove({"_id": id}, function(err, items) {
        if (items == '1'|| typeof items != 'object') {
            items = [{}];
        }
        callback(err, items);
    });
};

exports.CRUD.prototype.post = function(collection, query, callback) {
    var id;

    id = new ObjectId();
    query.body._id = id;
    if(query.body.password) {
        query.body.password = bcrypt.hashSync(query.body.password, 10);
    }
    var me = this;
    var insertCallback = function(query, callback, err) {
        
        if (err)
            callback(err, null);
        else {
            collection_config.getFormat(collection, 'post', query.body, function(obj, err) {
                if(err)
                    return callback(err, null);
                else {
                    me.db.collection(collection).insert(query.body, function(err, items) {
                        streamjobs.manage(items, function(error, res) {
                            return callback(err, items);
                        });
                    });
                }
                
            });
        }
    };
    if (query.files && Object.keys(query.files).length >= 1) {
        console.log("FILES", query.files, typeof query.files);
        var cpt =0,
        len = Object.keys(query.files).length;
        
        for (fileIndex in query.files){
            var tmpFile = query.files[fileIndex];
            console.log(tmpFile.fieldName+'_'+id);
            var img = fs.readFileSync(tmpFile.path);
            var gridStore = new GridStore(me.db, tmpFile.fieldName+'_'+id,'w');
            gridStore.open(function(err, gridStore) {
                console.log("ERR",err);
                gridStore.write(new Buffer(img), function(err, gridStore) {
                    console.log(gridStore.fileId, gridStore.filename);
                    gridStore.close(function(err, fileData) {
                        cpt++;
                        if(cpt == len){
                            insertCallback(query, callback, err);
                        }
                    });
                });
            });
        }
    } else {
        console.log("no files");
        insertCallback(query, callback);
    }
    
};