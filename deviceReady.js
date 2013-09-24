define(function(){
	var ready = false;
	var readyQ = [];

	if(window.cordova){
		document.addEventListener("deviceready", function(){
			ready = true;
			while(readyQ.length){
				(readyQ.shift())();
			}
		});
	}

	function deviceReady(callback){
		// summary:
		//		In Cordova context executes when the Cordova deviceready event has been fired. In non-Cordova context
		//		executes immediately irrespective of the deviceready event.
		if(ready || !window.cordova){
			callback();
		}else{
			readyQ.push(callback);
		}
	}

	deviceReady.load = function(id, req, load){
		deviceReady(load);
	};

	return deviceReady;
});