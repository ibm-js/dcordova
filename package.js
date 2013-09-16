var profile = (function(){
	var testResourceRe = /\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				// these are modules that are not intended to ever be built
				"dcordova/dcordova.profile":1,
				"dcordova/package.json":1,
				"dcordova/tests":1
			};
			return (mid in list) || /^dcordova\/resources\//.test(mid) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
		}

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid);
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
			}
		}
	};
})();
