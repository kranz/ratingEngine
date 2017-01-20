"use strict";
var hana = require("./database");
module.exports = {
   dbCall: function(wss){
   	  function dummy(){}
	wss.broadcast("HO PREMUTO DB1");
	wss.broadcast("Before Database Call");
	hana.callHANA1(dummy, wss);
	hana.callHANA2(dummy, wss);
	wss.broadcast("After Database Call");	
  }
};