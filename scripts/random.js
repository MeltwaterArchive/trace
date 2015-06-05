/**
 * This variable is used to generate random data to show off trace
 */
var Random = function () {};

/**
 * Get Series
 *
 * Generate a random set of data for trace as a series object, if you pass in the id it will return
 * the data prefixed with the name. Otherwise it will choose one from random.
 * 
 * @param  {[type]} name [description]
 * @return {[type]} [description]
 */
Random.prototype.getSeries = function (name, items) {

	var obj = {};
	items = items ? items : 10;

	// turn the object into a name
	obj = [];

	for (var i = 0; i < items; i++) {
		// a random x and y number
		obj.push([i, Math.round(Math.random() * 10)]);
	}

	return obj;

};

/**
 * Makes a random string
 * 
 * @return {[type]} [description]
 */
Random.prototype._makeName = function () {
	var text = "",
	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};