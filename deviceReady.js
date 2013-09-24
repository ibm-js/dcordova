define(function(){
	var ready = false;
	var readyQ = [];

	if(window.cordova){
		document.addEventListener("deviceready", function(){
			ready = true;
			while(readyQ.length){
				(readyQ.shift())(true);
			}
		});
	}

	function deviceReady(callback){
		// summary:
		//		In Cordova context executes when the Cordova deviceready event has been fired. In non-Cordova context
		//		executes immediately irrespective of the deviceready event. The callback receives true as its first and
		// 		single argument in Cordova context and false otherwise.
		if(ready || !window.cordova){
			callback(!!window.cordova);
		}else{
			readyQ.push(callback);
		}
	}

	deviceReady.load = function(id, req, load){
		deviceReady(load);
	};

	return deviceReady;
});