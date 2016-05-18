Object.prototype.extend = function(obj) {
	var result_object = this.clone();

	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			result_object[i] = obj[i];
		}
	}
	return result_object;
};

Object.prototype.clone = function() {
    if (null == this || "object" != typeof this) return this;
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
};

module.exports = {
	getDateFormatedFileSystem: function() {
		var date = new Date().toISOString();
	    date = date.replace(/-/gi, "_");
	    date = date.replace(/:/gi, "_");
	    date = date.replace(/T/gi, "__");
	    date = date.slice(0, 20);
	    return date;
	},
	getDateFormated: function() {
	    var date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var time = this.prependZero(day) + "/"  + this.prependZero(month) + "/" + year + " " + this.prependZero(hours) + ":" + this.prependZero(minutes) + ":" + this.prependZero(seconds);
		return time;
	},
	stripHTML: function(html) {
	    html=html.replace(/<br>/gi, "\n");
	    html=html.replace(/<p.*>/gi, "\n");
	    html=html.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
	    html=html.replace(/<(?:.|\s)*?>/g, "");
	    return html;
	},
	printLogo: function() {
		console.log(" ____  _____   _                _         ______            _    ");
		console.log("|_   \|_   _| (_)              (_)       |_   _ \          / |_  ");
		console.log("  |   \ | |   __   _ .--.      __  ,--.    | |_) |   .--. `| |-' ");
		console.log("  | |\ \| |  [  | [ `.-. |    [  |`'_\ :   |  __'. / .'`\ \| |   ");
		console.log(" _| |_\   |_  | |  | | | |  _  | |// | |, _| |__) || \__. || |,  ");
		console.log("|_____|\____|[___][___||__][ \_| |\'-;__/|_______/  '.__.' \__/  ");
		console.log("                            \____/                               ");
		console.log("Pedro Henrique - system.pedrohenrique@gmail.com------------------");
		console.log("Check Reddit posts Module");
		console.log("http://pedrohenrique.ninja");
	}, 
	prependZero: function(value) {
		value = parseInt(value, 10);
		if (value < 10) {
			value = "0" + value;
		}
		return value;
	},
	getTimeSeconds: function() {
		var seconds = new Date() / 1000;
		return parseInt(seconds, 10);
	}
};

