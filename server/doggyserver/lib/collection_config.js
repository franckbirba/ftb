var ObjectId = require('mongodb').ObjectID;


exports.collection_config = {
    grif: {
	fields: [
	    {
		name: "date",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    }
	]
    },
    event: {
	index: {
	    "title": 1
	},
	unicity: {
	    unique: true,
	    dropDups: true
	},
	fields: [
	    {
		name: "title",
		format: "string",
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "start",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "finish",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "keywords",
		format: "stringArray",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "tags",
		format: "stringArray",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "hashtags",
		format: "stringArray",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "hidden",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    }
	]
    },
    milestone: {
	index: {
	    "title": 1,
	    "eventId": 1
	},
	unicity: {
	    unique: true,
	    dropDups: true
	},
	fields: [
	    {
		name: "title",
		format: "string",
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "eventId",
		format: "string",
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "publish",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "start",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "finish",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "keywords",
		format: "stringArray",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    }
	]
    },
    post: {
	index: {
	    "provider": 1,
	    "providerId": 1
	},
	unicity: {
	    unique: true,
	    dropDups: true
	},
	fields: [
	    {
		name: "providerId",
		format: "number",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "typeMedia",
		format: "string",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "providerTimestamp",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "video",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "photo",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "news",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "parsed",
		format: "boolean",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "timestamp",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    }
	]
    },
    media: {
	index: {
	    "displayUrl": 1
	},
	unicity: {
	    unique: true,
	    dropDups: true
	},
	fields: [
	    {
		name: "timestamp",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "providerTimestamp",
		format: "timestamp",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "date",
		format: "date",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "providerDate",
		format: "date",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "displayUrl",
		format: "string",
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    }
	]
    },
    people: {
	index: {
	    "name": 1,
	    "provider": 1,
	    "providerId": 1
	},
	unicity: {
	    unique: true,
	    dropDups: true
	},
	fields: [
	    {
		name: "name",
		format: "string",
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "firstName",
		format: "string",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "lastName",
		format: "string",
		required: {
		    post: false,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "provider",
		format: "string",
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "providerId",
		format: "number",
	    default: function(obj){
		var tmpId = new ObjectId();
		obj._id = tmpId;
		return tmpId;
	    },
		required: {
		    post: true,
		    put: false,
		    get: false,
		    delete: false
		}
	    }
	]
    },
    link: {
	index: {
	    "from": 1,
	    "to": 1,
	    "fromValue":1,
	    "toValue":1,
	    "type":1
	},
	unicity: {
	    unique: true,
	    dropDups: true
	},
	fields: [
	    {
		name: "from",
		format: "string",
		required: {
		    post: true,
		    put: true,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "to",
		format: "string",
		required: {
		    post: true,
		    put: true,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "fromValue",
		format: "string",
		required: {
		    post: true,
		    put: true,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "toValue",
		format: "string",
		required: {
		    post: true,
		    put: true,
		    get: false,
		    delete: false
		}
	    },
	    {
		name: "type",
		format: "string",
		required: {
		    post: true,
		    put: true,
		    get: false,
		    delete: false
		}
	    }

	]
    },

    initIndexes : function(db, callback) {
	var tmpCols = this;
	var length = tmpCols.length;
	var cpt = 0;
	if (INIT_INDEXES) {
	    console.log('INIT_INDEXES');
	    for (tmpColId in tmpCols) {
		var tmpCol = tmpCols[tmpColId];
		var tmpUniCity = tmpCol.unicity ? tmpCol.unicity : {unique:false};
		if (tmpCol.index) {
		    db.collection(tmpColId).dropIndexes(function() {
			db.collection(tmpColId).ensureIndex(tmpCol.index, tmpUniCity, function() {
			    cpt++;
			    if(cpt == length && callback)
				return callback();
			});
		    });
		}
	    }
	}
	if (callback)
	    return callback();
    },

    getFormat: function(collection, method, obj, callback) {
	var tmpCol = this[collection];
	if (!tmpCol)
	    return callback(obj);

	for (tmpFieldId in tmpCol.fields) {
	    var tmpField = tmpCol.fields[tmpFieldId];
	    if(obj.hasOwnProperty(tmpField.name)) {
		if(tmpField.format == "date") {
		    obj[tmpField.name] = new Date(Number(obj[tmpField.name]));
		} else if (tmpField.format == "number") {
		    obj[tmpField.name] = Number(obj[tmpField.name]);
		} else if (tmpField.format == "boolean") {
		    obj[tmpField.name] = String(obj[tmpField.name]).toLowerCase() == "true";
		} else if (tmpField.format == "stringArray") {
		    obj[tmpField.name] = obj[tmpField.name].split(',');
		} else if (tmpField.format == "timestamp") {
		    obj[tmpField.name] = new Date(Number(obj[tmpField.name])).getTime();
		}
		//return callback(obj);
	    } else if (tmpField.required[method] && tmpField.default) {
		obj[tmpField.name] = tmpField.default(obj);
	    } else if (tmpField.required[method]) {
		return callback(obj, {msg:"missing required field " + tmpField.name});
	    }
	}
	return callback(obj);
    }
};