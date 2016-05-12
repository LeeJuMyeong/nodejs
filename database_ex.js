var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '4050'
});
var ipAdd;
connection.connect(function(err) {
	if (!err) {
		console.log('\n\nDatabase is connected ... \n\n');
	} else {
		console.log('Error connecting database ... \n\n');
	}
});

connection.query('use kanglab_database');

/*
connection.query('select * from users', function(err, rows, fields) {
	if (!err) {
		console.log('The solution is : ', rows);
	} else {
		console.log('Error while performing Query.');
	}
});
*/


connection.query('select ip_address from users where ip_address = \'127.0.0.1\'', function(err, rows, fields) {
	if (!err) {
		console.log('The solution is : ', rows);
		ipAdd = JSON.stringify(rows[0].ip_address);
		ipAdd = ipAdd.split("\"");
		console.log(ipAdd[1]);

	} else {
		conection.release();
		throw err;
		//console.log('Error while performing Query.');
	}
});

connection.end();
