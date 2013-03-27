//	Has rules defined by this module:
//	"cordova"						Returns true if running under Cordova, else false
//	"cordova-accelerometer"			Returns true if has accelerometer access, else false
//	"cordova-camera"				Returns true if has camera / album access, else false
//	"cordova-capture-audio"			Returns true if has audio capture access, else false
//	"cordova-capture-image"			Returns true if has image capture access, else false
//	"cordova-capture-video"			Returns true if has video capture access, else false
//	"cordova-compass"				Returns true if has compass access, else false
//	"cordova-connection-ethernet"   Returns true if has ethernet connection, else undefined
//  "cordova-connection-wifi"		Returns true if has wifi connection, else undefined
//	"cordova-connection-cell-2g"	Returns true if has 2g connection, else undefined
//	"cordova-connection-cell-3g"	Returns true if has 3g connection, else undefined
//	"cordova-connection-cell-4g"	Returns true if has 4g connection, else undefined
//	"cordova-connection-none"		Returns true if has no connection, else undefined
//	"cordova-connection-unknown"	Returns true if has an unknown connection, else undefined
//	"cordova-contacts"				Returns true if has contact list access, else false
//	"cordova-device"				Returns device object if running on a device, else false
//	"cordova-platform"				Returns platform name (eg "Android") if running on a device, else false
//	"cordova-android"				Returns Android OS version if running on Android, else false
//	"cordova-iphone"				Returns iPhone OS version if running on iPhone, else false
//	"cordova-ipad"					Returns iPad OS version if running on iPad, else false
//	"cordova-ios"					Returns IOS OS version if running on IOS device, else false
//	"cordova-blackberry"			Returns Blackberry OS version if running on Blackberry, else false
//	"cordova-windows"				Returns Windows OS version if running on Windows, else false
//	"cordova-webos"					Returns WebOS OS version if running on WebOS, else false
//	"cordova-file"					Returns true if has file system access, else false
//	"cordova-geolocation"			Returns true if has geolocation access, else false
//	"cordova-media"					Returns true if has audio record/play access, else false
//	"cordova-alert"					Returns true if has native alert dialog, else false
//	"cordova-confirm"				Returns true if has native confirm dialog, else false
//	"cordova-beep"					Returns true if can sound a device beep, else false
//	"cordova-storage"				Returns true if has local database access, else false
define(["dojo/has"], function(has){
	has.add("cordova", function(){
		return window.device ? window.device.cordova : false;
	});
	has.add("cordova-accelerometer", function(){
		return !!(has("cordova") && navigator.accelerometer);
	});
	has.add("cordova-camera", function(){
		return !!(has("cordova") && navigator.camera);
	});
	has.add("cordova-audio", function(){
		return !!(has("cordova") && navigator.device.capture && navigator.device.capture.captureAudio);
	});
	has.add("cordova-capture-audio", function(){
		return !!(has("cordova") && navigator.device.capture && navigator.device.capture.captureAudio);
	});
	has.add("cordova-capture-image", function(){
		return !!(has("cordova") && navigator.device.capture && navigator.device.capture.captureImage);
	});
	has.add("cordova-capture-video", function(){
		return !!(has("cordova") && navigator.device.capture && navigator.device.capture.captureVideo);
	});
	has.add("cordova-compass", function(){
		return !!(has("cordova") && navigator.compass);
	});
	if(has("cordova") && window.Connection){
		var map = { }, type = navigator.network && navigator.network.connection && navigator.network.connection.type;
		map[window.Connection.UNKNOWN] = "cordova-connection-unknown";
		map[window.Connection.ETHERNET] = "cordova-connection-ethernet";
		map[window.Connection.WIFI] = "cordova-connection-wifi";
		map[window.Connection.CELL_2G] = "cordova-connection-cell-2g";
		map[window.Connection.CELL_3G] = "cordova-connection-cell-3g";
		map[window.Connection.CELL_4G] = "cordova-connection-cell-4g";
		map[window.Connection.NONE] = "cordova-connection-none";
		has(map[type], true);
	}
	has.add("cordova-contacts", function(){
		return !!(has("cordova") && navigator.contacts);
	});
	has.add("cordova-platform", function(){
		return has("cordova") ? window.device.platform : false;
	});
	has.add("cordova-android", function(){
		return (window.device && window.device.platform.match(/android/i) ) ? window.device.version : false;
	});
	has.add("cordova-iphone", function(){
		return (window.device && window.device.platform.match(/iphone/i) ) ? window.device.version : false;
	});
	has.add("cordova-ipad", function(){
		return (window.device && window.device.platform.match(/ipad/i) ) ? window.device.version : false;
	});
	has.add("cordova-ios", function(){
		return has("cordova-iphone") || has("cordova-ipad");
	});
	has.add("cordova-blackberry", function(){
		return (window.device && window.device.platform.match(/blackberry/i) ) ? window.device.version : false;
	});
	has.add("cordova-windows", function(){
		return (window.device && window.device.platform.match(/win/i) ) ? window.device.version : false;
	});
	has.add("cordova-webos", function(){
		return (window.device && window.device.platform.match(/webod/i) ) ? window.device.version : false;
	});
	has.add("cordova-file", function(){
		return !!(has("cordova") && window.requestFileSystem);
	});
	has.add("cordova-geolocation", function(){
		return !!(has("cordova") && navigator.geolocation && navigator.geolocation.getPosition);
	});
	has.add("cordova-media", function(){
		return !!(has("cordova") && window.Media);
	});
	has.add("cordova-alert", function(){
		return !!(has("cordova") && navigator.notification && navigator.notification.alert);
	});
	has.add("cordova-confirm", function(){
		return !!(has("cordova") && navigator.notification && navigator.notification.confirm);
	});
	has.add("cordova-beep", function(){
		return !!(has("cordova") && navigator.notification && navigator.notification.beep);
	});
	has.add("cordova-storage", function(){
		return !!(has("cordova") && window.openDatabase);
	});
});