define(["dojo/_base/declare", "dojo/Deferred", "dojo/when", "dojo/store/util/QueryResults", "dojo/store/util/SimpleQueryEngine"],
	function(declare, Deferred, when, QueryResults, SimpleQueryEngine){

	return declare(null, {
		// summary:
		//		This is a dojo/store wrapper for Cordova Contacts API.

		// contactsFields: String[]
		//		Defines array of contact fields that are returned when doing a query
		contactFields: ["id", "displayName", "name", "phoneNumbers", "emails", "addresses", "organizations"],

		// queryEngine: Function
		//		Defines the query engine to use for querying the data store
		queryEngine: SimpleQueryEngine,

		constructor: function(options){
			// summary:
			//		Creates a contacts object store.
			declare.safeMixin(this, options);
		},

		get: function(id){
			//	summary:
			//		Retrieves an object by its identity.
			//	id: String
			//		The identity to use to lookup the object
			//	returns: Object
			//		The object in the store that matches the given id.
			var deferred = new Deferred();
			this._find(id,
				function(contacts){
					// search is by keyword on all fields, so we need to double check
					// we did not get false positive results
					var i;
					for(i = 0; i < contacts.length; i++){
						if(contacts[i].id == id){
							deferred.resolve(contacts[i]);
							return;
						}
					}
					deferred.resolve(null);
				},
				deferred, { multiple: false });
			return deferred.promise;
		},

		getIdentity: function(object){
			//	summary:
			//		Returns an object's identity
			//	object: Object
			//		The object to get the identity from
			//	returns: String
			return object.id;
		},

		query: function(query, options){
			var deferred = new Deferred();
			// get a minimal cordova API query from a the dojo/store type of query
			var cordovaQuery = "", key;
			for(key in query){
				if(!(query[key] instanceof RegExp)){
					cordovaQuery = query[key];
					break;
				}
			}
			this._find(cordovaQuery,
				function(contacts){
					deferred.resolve(contacts);
				},
				deferred, options);
			return new QueryResults(this.queryEngine(query, options)(deferred.promise));
		},

		// All the code below depends on Cordova Contacts API

		_find: function(query, success, deferred, options){
			var opts = new ContactFindOptions();
			var fields = (options && options.contactFields) || this.contactFields;
			opts.filter = query;
			opts.multiple = (options && options.hasOwnProperty("multiple")) ? options.multiple : true;
			navigator.contacts.find(fields, success, function(error){deferred.reject(error);}, opts);
		},

		put: function(object, directives){
			var deferred = new Deferred(), self = this;
			if(directives && directives.hasOwnProperty("id")){
				object.id = directives.id;
			}
			if(directives && directives.overwrite === false){
				when(this.get(object.id), function(contact){
					if(contact !== null){
						deferred.reject(new Error("object already exists"));
					}else{
						self._put(object, deferred);
					}
				});
			}else{
				this._put(object, deferred);
			}
			return deferred.promise;
		},

		_put: function(object, deferred){
			var contact = typeof object.save === "function" ? object : navigator.contacts.create(object);
			contact.save(function(contact){deferred.resolve(contact);}, function(error){deferred.reject(error);});
		},

		add: function(object, directives){
			(directives = directives || {}).overwrite = false;
			return this.put(object, directives);
		},

		remove: function(id){
			var deferred = new Deferred();
			var object = this.get(id);
			when(object, function(object){
				object.remove(function(contact){deferred.resolve(contact);}, function(error){deferred.reject(error);});
			});
			return deferred.promise;
		}
	});
});
