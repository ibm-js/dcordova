define(["dojo/_base/declare", "dojo/Deferred", "dojo/store/util/QueryResults", "dojo/store/util/SimpleQueryEngine"],
	function(declare, Deferred, QueryResults, SimpleQueryEngine){

	return declare(null, {
		// summary:
		//		This is a dojo/store wrapper for Cordova Contacts API.

		// displayName: Boolean
		//		Whether the store must force the presence of displayName property when null. Default is false.
		displayName: false,

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
						// Cordova advertise String ids but at least sometimes we get Number...
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
			var findDeferred = new Deferred(), deferred = new Deferred();
			var self = this;
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
					findDeferred.resolve(contacts);
				},
				findDeferred, options);
			findDeferred.then(function(contacts){
				if(self.displayName){
					var contact, i;
					for(i = 0; i < contacts.length; i++){
						contact = contacts[i];
						if(!contact.displayName && contact.name.formatted){
							contact.displayName = contact.name.formatted;
						}
					}
				}
				deferred.resolve(self.queryEngine(query, options)(contacts));
			}, function(error){
				deferred.reject(error);
			});
			return QueryResults(deferred.promise);
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
				this.get(object.id).then(function(contact){
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
			var self = this;
			contact.save(function(contact){
				if(self.displayName && !contact.displayName && contact.name.formatted){
					contact.displayName = contact.name.formatted;
				}
				deferred.resolve(contact);
			}, function(error){deferred.reject(error);});
		},

		add: function(object, directives){
			(directives = directives || {}).overwrite = false;
			return this.put(object, directives);
		},

		remove: function(id){
			var deferred = new Deferred();
			var object = this.get(id);
			object.then(function(object){
				object.remove(function(contact){deferred.resolve(contact);}, function(error){deferred.reject(error);});
			});
			return deferred.promise;
		}
	});
});
