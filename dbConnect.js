const sql = require("mysql");

const con = sql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "userData",
});

con.connect((error) => {
	if (error) {
		console.warn(error);
	} else {
		console.warn("connected");
	}
});

con.query("select * from person", (error, result) => {
	// console.warn("result= ", result);
});

module.exports = con;
