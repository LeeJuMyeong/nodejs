var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '4050'
});
var ipAdd;		// db에서 받아올 client의 ip주소 데이터
var client_ipAdd;	// request에 있는 client의 ip주소 데이터 
var http = require('http');  // node 내장 모듈 불러옴
var sys = require('sys');  
var mysql = require('mysql');

var hostname = '192.168.56.101';  
var port = 3000;	// port number
var check_point = 0;
/*
//Get client ip address 
function getClientAddress(req) {
	var ipAddress;
	var forwardedIpsStr = req.header('x-forwarded-for');
	if (forwardedIpsStr) {
		var forwardeIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;
}
*/

setTimeout(function() {
	sys.puts('world');
}, 2000); // 4s


// 서버를 생성!!!!!
http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });	
	//while (check_IP_address == '192.168.56.101') {}
	client_ipAdd = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
	console.log(client_ipAdd);

	if (req.method = 'GET') {
		console.log('GET');
		// 요청이 오는 ipAddress 저장 
	} else if (req.method = 'POST') {
		console.log('POST');
	}

	if (!client_ipAdd) {
		
	} else {
		if (check_point == 0) {
			var getIpAdd = get_ip_address(client_ipAdd);
			check_point = 1;
		} else {
		}
	}
	res.end('Hello World\n');	//응답 본문 작성
}).listen(port, hostname);


console.log('Server running at http://' + hostname + ' : ' + port);

// 
function get_ip_address(ip_add) {
var get_ip_address;
connection.connect(function(err) {

	if (!err) {
		console.log('\n\nDatabase is connected ... \n\n');
	} else {
		console.log('Error connecting database ... \n\n');
	}
});

connection.query('use kanglab_database');

connection.query('select ip_address from users where ip_address = ?', ip_add, function(err, rows, fields) {
	if (!err) {
		console.log('The solution is : ', rows);
		// 조건문 ...		
		// 같은 아이피가 2개 이상이거나, 저장되어있는 아이피 주소가 아니던가 등등 
		// 조건 필요!!!

		ipAdd = JSON.stringify(rows[0].ip_address);
		ipAdd = ipAdd.split("\"");
		console.log(rows.length + " : " + ipAdd[1]);
		get_ip_address	= ipAdd[1];	

	} else {
		connection.release();
		throw err;
		//console.log('Error while performing Query.');
	}
});

connection.end();

return get_ip_address;
}
/*
setTimeout(function() {
	sys.puts('world');
}, 2000); // 4s
http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });	
	//while (check_IP_address == '192.168.56.101') {}
	
	res.end('Hello World\n');	// 서버가 끝날 때 사용됨
}).listen(port, hostname);
console.log('Server running at http://' + hostname + ' : ' + port);*/
