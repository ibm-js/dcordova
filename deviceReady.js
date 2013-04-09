define(function(){
	var ready = false;
	var readyQ = [];

	document.addEventListener("deviceready", function(){
		ready = true;
		while(readyQ.length){
			(readyQ.shift())();
		}
	});

	function deviceReady(callback){
		if(ready){
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