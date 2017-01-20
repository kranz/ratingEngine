/*eslint no-console: 0, no-unused-vars: 0, no-undef: 0, no-shadow: 0*/
"use strict";
var hdb = require("sap-hdbext");
var xsenv = require("sap-xsenv");
var async = require("async");
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
var pool = hdb.getPool(hanaOptions.hana);

module.exports = {
	callHANA: function(wss) {
		pool.acquire(null, function(error, client) {
			if (error) {
				console.error(error);
			}
			if (client) {
				wss.broadcast("Database Connected");
				client.exec("select TOP 25 * from \"TariffRules.Tariff\"",
					function(err, res, cb) {
						if (err) {
							return ("ERROR: " + err);
						}
						wss.broadcast("Database Call Complete");
						for (var i = 0; i < res.length; i++) {
							wss.broadcast(res[i].SEQNUM + ": " + res[i].NAME + "\n");
						}
						client.disconnect(function(cb) {
							wss.broadcast("Database Disconnected");
							pool.release(client);
						});
					});
			} //End if client
		}); //end create connection      
		cb();
	}, //end callHANA

	callHANA1: function(cb, wss) {
		//hdb.createConnection(hanaService, function(error, client) {
		pool.acquire(null, function(error, client) {
			if (error) {
				console.error(error);
			}
			if (client) {

				async.waterfall([

					function execute(callback) {
						wss.broadcast("Database Connected #1");
						client.exec("select TOP 25 * from \"TariffRules.Tariff\"",
							function(err, res) {
								if (err) {
									return ("ERROR: " + err);
								}
								callback(null, err, res);
							});

					},

					function processResults(err, res, callback) {
						if (err) {
							return ("ERROR: " + err);
						}
						wss.broadcast("Database Call  #1");
						wss.broadcast("--TR Tariff");
						for (var i = 0; i < res.length; i++) {
							wss.broadcast(res[i].SEQNUM + ": " + res[i].NAME);
						}
						wss.broadcast("\n");
						client.disconnect(callback);
					},

					function disconnectDone(callback) {
						wss.broadcast("Database Disconnected #1");
						wss.broadcast("End Waterfall #1");
						pool.release(client);
						cb();
					}

				], function(err, result) {
					wss.broadcast(err || "done");
					wss.broadcast("Error Occured disrupting flow of Waterfall for #1");
					pool.release(client);
					cb();
				}); //end Waterfall

			} //end if client
		}); //end create connection

	}, //end callHANA1

	callHANA2: function(cb, wss) {

			//hdb.createConnection(hanaService, function(error, client) {
			pool.acquire(null, function(error, client) {
				if (error) {
					console.error(error);
				}
				if (client) {

					async.waterfall([

						function execute(callback) {
							wss.broadcast("Database Connected #2");
							client.exec("select TOP 25 * from \"TariffRules.Rule\"",
								function(err, res) {
									if (err) {
										return ("ERROR: " + err);
									}
									callback(null, err, res);
								});

						},

						function processResults(err, res, callback) {
							if (err) {
								return ("ERROR: " + err);
							}
							wss.broadcast("Database Call  #2");
							wss.broadcast("--TR Rules");
							for (var i = 0; i < res.length; i++) {
								wss.broadcast(res[i].TARIFF_ID + ": " + res[i].ID);
							}
							wss.broadcast("\n");
							client.disconnect(callback);
							wss.broadcast("Ho eseguito client.disconnect(callback)");

						},

						function disconnectDone(callback) {
							wss.broadcast("Database Disconnected #2");
							wss.broadcast("End Waterfall #2");
							pool.release(client);
							cb();
						}

					], function(err, result) {
						wss.broadcast(err || "done");
						wss.broadcast("Error Occured disrupting flow of Waterfall for #2");
						pool.release(client);
						cb();
					}); //end Waterfall
				} //end if client
			}); //end create connection

		} //end callHANA2
};