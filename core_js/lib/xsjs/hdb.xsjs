/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
"use strict";

var conn = $.hdb.getConnection();
var query = "SELECT FROM TariffRules.Rule { " +
	        " ID as \"RuleId\", " +
            " SEQNUM as \"Progressivo\", " +
            " CODE as \"Codice\", " +
            " DESCRIPTION as \"Descrizione\" " +
            " } ";
var rs = conn.executeQuery(query);

var body = "";

for(var i = 0; i < rs.length; i++){
	body += rs[i]["RuleId"] + "\t" + rs[i]["Progressivo"] + "\t" + 
			rs[i]["Codice"] + "\t" + rs[i]["Descrizione"] + "\n";
}

$.response.setBody(body);
$.response.contentType = "application/vnd.ms-excel; charset=utf-16le";
$.response.headers.set("Content-Disposition","attachment; filename=Excel.xls");
$.response.status = $.net.http.OK;