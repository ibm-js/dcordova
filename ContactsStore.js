define(["dojo/_base/declare", "dojo/Deferred", "dojo/store/util/QueryResults"],
	function(declare, Deferred, QueryResults){

	return declare(null, {
		// summary:
		//		This is a dojo/store wrapper for Cordova Contacts API.

		contactFields: ["id", "displayName", "name", "phoneNumbers", "emails", "addresses"],

		constructor: function(options){
			// summary:
			//		Creates a contacts object store.
			declare.safeMixin(this, options);
		},

		get: function(id){
			//	summary:
			//		Retrieves an object by its identity.
			//	id: Number
			//		The identity to use to lookup the object
			//	returns: Object
			//		The object in the store that matches the given id.
			var deferred = new Deferred();
			this._find(["id"],
				function(contacts){
					// search is by keyword on all fields, so we need to double check
					// we did not get false positive results
					for(var i = 0; i < contacts.length; i++){
						if(contacts[i]["id"] == id){
							deferred.resolve(contacts[i]);
							return;
						}
					}
					deferred.reject(new Error("id not match."));
				},
				deferred, id);
			return deferred.promise;
		},

		getIdentity: function(object){
			// summary:
			//		Returns an object's identity
			// object: Object
			//		The object to get the identity from
			//	returns: String|Number
			return object["id"];
		},

		query: function(query, options){
			var deferred = new Deferred();
			this._find(query?query:"",
				function(contacts){
					deferred.resolve(contacts);
				},
				deferred, options);
			// TODO: what about queryEngine?
			return new QueryResults(deferred.promise);
		},

		// All the code below depends on Cordova Contacts API

		_find: function(query, success, deferred, options){
			var opts = new ContactFindOptions();
			var fields = (options && options.contactFields) || this.contactFields;
			opts.filter = query;
			opts.multiple = (options && options.hasOwnerProperty("multiple")) ? options.multiple : true;
			navigator.contacts.find(fields, success, function(error){deferred.reject(error)}, opts);
		},

		put: function(object){
			var contact = typeof object.save === "function" ? object : navigator.contacts.create(object);
			var id = this.getIdentity(contact);
			var deferred = new Deferred();
			if(typeof id != "undefined"){
				contact.save(function(contact){deferred.resolve(contact)}, function(error){deferred.reject(error)});
			}else{
				deferred.reject(new Error("contact must have an id"));
			}
			return deferred.promise;
		},

		add: function(object, directives){
			if(directives && directives.hasOwnProperty("id")){
				object.id = directives.id;
			}
			var deferred = new Deferred();
			if(object.hasOwnProperty("id")){
				// if the object has a save method it has been created, use it, otherwise create it before
				var contact = typeof object.save === "function" ? object : navigator.contacts.create(object);
				contact.save(function(contact){deferred.resolve(contact)}, function(error){deferred.reject(error)});
			}
			return deferred.promise;
		},

		remove: function(id){
			var deferred = new Deferred();
			var object = this.get(id);
			object.remove(function(contact){deferred.resolve(contact)}, function(error){deferred.reject(error)});
			return deferred.promise;
		}
	});
});
