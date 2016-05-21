var net = require('net'); 
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '4050'
});

var ipAdd;		// db에서 받아올 client의 ip주소 데이터
var client_ipAdd;	// request에 있는 client의 ip주소 데이터
	
var sys = require('sys');  
var mysql = require('mysql');
var isData;
//var hostname = '192.168.56.101';  
var port = 8107;	// port number

var heartBeatTime = [];
var clients = [];
var client_num;
var ipAdd;


connection.connect(function(err) {
	if (!err) {
		console.log('\n\nDatabase is connected ... \n\n');
	} else {	
		throw err;
		console.log('Error connecting database ... \n\n');
	}
});

var server = net.createServer(function(client){ 	
	
	console.log('\r\n[클라이언트 연결]\r\n');
	console.log(' local = %s:%s \r\n', client.localAddress, client.localPort);
	console.log(' remote = %s:%s \r\n', client.remoteAddress, client.remotePort);
	// typeof(client.localAddress) : string
	
	
	client_ipAdd = client.localAddress;
	
	// 5초가 지나면 자동으로 서버에서 클라이언트와의 연결을 종료
	client.setTimeout(5000, function() {
		console.error("Ten second timeout slapsed.");
		client.end();
		// 타이머 시작!!!
		console.log("\r\n!!!!!!!!!!!!!!!!!![4]\r\n");
		console.log(client_num + "\r\n");
		heartBeatTime[client_num] = setTimeout(function() {	
			// 쿼리!!! 
			// 현재 데이터베이스의 ip 주소 값을 0으로 초기화하는 쿼리
			clients[client_num];
			
			connection.query('use kanglab_database');
			connection.query('update users set ip_address = \'0\' where ip_address = ?', clients[client_num], function(err, rows, fields) {
				if (!err) {	
					console.log('\r\n[heartBeat 끊김...]\r\n');
				} else {
				throw err;
				connection.end();		
				}		
			});
			console.log('\r\n[Timeout]\r\n');
		}, 20000);
		console.log(heartBeatTime[client_num] + "\r\n");
		// 20초 동안 유지되는 setTimeout() 
	});
	
	client.setEncoding('utf8');
	/*
	// 현재 실행 x
	client.on('connect', function() {
		console.log('\r\n-------------------\r\n');
		console.log('\r\n[클라이언트 저장]\r\n');
		console.log('\r\n-------------------\r\n');
	});
	*/
	client.on('data', function(data) { 
		console.log('\r\n-------------------\r\n');
		console.log('[클라이언트의 데이터]\r\n');
		console.log(' 보낸 데이터 정보: ' + data.toString());
		console.log('\r\n[서버에서 데이터 전송 중...]');

		isData = data.toString();
		
		// 클라이언트의 ip 주소 값을 반환
		var get_ipAdd = client.localAddress.split("\:");
		var split_get_ipAdd = get_ipAdd[3].toString();
	
		// 클라이언트 ip 주소 전에도 같은 ip 주소가 있었다면,
		// 타이머 초기화하고 다시 시작 !!
		
		// ip 주소값이 저장된 것이 있는 지 확인 !!
		if (clients.length != 0) {
			var check = 1;
			console.log("\r\n!!!!!!!!!!!!!!!!!![1]\r\n");
			for (var i = 0; i < clients.length; i++) {
			// ip 주소 값이 동일한 것이 있는지 확인!!!
				if (split_get_ipAdd == clients[i]) {
				// 같은 주소값이 있을 때, 
					console.log("\r\n!!!!!!!!!!!!!!!![3]\r\n");
					console.log(i + "\r\n" );
					clearTimeout(heartBeatTime[i]);	// heartBeat를 초기화 
					console.log(heartBeatTime[i] + "\r\n");
					client_num = i;
					check = 0;
				}
			}
			if (check == 1) {
			// 같은 주소값이 없을 때, ip 주소 저장하기!!!
				clients[clients.length + 1] = split_get_ipAdd;
				client_num = clients.length + 1;
			}
		} else {
			// ip 주소 값이 저장된 것이 없을 때,
			
			console.log("\r\n!!!!!!!!!!!!!!!!![2]\r\n");
			clients[0] = split_get_ipAdd;
			client_num = 0;
			// 클라이언트의 ip 주소 값을 저장!!!	 
		} 
		
		
		// answer이라는 data를 보낼 때만, 확인
		if (data == 'answer') {
			// data를 보냄!!!
			console.log("\r\n[요청]answer -> 클라이언트 정보...");
		
			console.log(split_get_ipAdd);
			console.log(typeof(split_get_ipAdd));
			
			get_ip_address(split_get_ipAdd, function (ip_add) {
			
					connection.query('use kanglab_database');
					connection.query('select ip_address from users where ip_address = ?', ip_add, function(err, rows, fields) {
					if (!err) {
					console.log('The solution is : ', rows);
					// 조건문 ...		
					// 같은 아이피가 2개 이상이거나, 
					// 저장되어있는 아이피 주소가 아니던가 등등 
					// 조건 필요!!!

					ipAdd = JSON.stringify(rows[0].ip_address);
					ipAdd = ipAdd.split("\"");
					console.log(rows.length + " : " + ipAdd[1]);
					split_get_ipAdd=ipAdd[1].toString();	

					} else {
					throw err;
					connection.end();		
					}		
				});
			});
			console.log(split_get_ipAdd);
			console.log(typeof(split_get_ipAdd));
			client.write("" + split_get_ipAdd);
		} else {
		// 그 이외의 data는 전부 무시!!
			console.log("잘못된 요청");
			client.write('No permission or wrong request...');
		}
		
		console.log('\r\n[서버에서 데이터 전송 완료...]');
		console.log('\r\n-------------------\r\n');
	}); 

	client.on('end', function() { 
		console.log('\r\n-------------------\r\n');
		console.log('\r\n[클라이언트 연결이 종료]\r\n'); 
		server.getConnections(function(err, count) {
			console.log('[Remaining Connections: ' + count + ']\r\n');
		});
		console.log('\r\n-------------------\r\n');
	}); 
	/*
	client.on('timeout', function() {
		console.log('\r\n[소켓 타임 아웃...]\r\n');
		server.getConnections(function(err, count) {
			console.log('[Remaining Connections: ' + count + ']\r\n');
		});
		client.end();
	});*/
	
	client.on('error', function(err) {
		console.log('\r\n-------------------\r\n');
		console.log('Socket Error: ', JSON.stringify(err));
		if (err.code === "ECONNRESET") {
			console.log('[클라이언트 강제 종료...]');	
		}
		server.getConnections(function(err, count) {
			console.log('[Remaining Connections: ' + count + ']\r\n');
		});
		console.log('\r\n-------------------\r\n');
	});
}); 


server.listen(port, function() { 
	console.log('\r\n[연결을 위한 서버 리스너...]');
	console.log('[Server listening: ' + JSON.stringify(server.address()) + ']\r\n');

	server.on('close', function() {
		console.log('\r\n[서버 종료...]');
	});

	server.on('error', function(err) {
		console.log('\r\nServer Error: ', JSON.stringify(err));
		if (err.code === "ECONNRESET") {
			console.log('[서버 강제 종료...]');	
		}
		server.getConnections(function(err, count) {
			console.log('[Remaining Connections: ' + count + ']\r\n');
		});
	});
});

function writeData(socket, data){
	var success = !socket.write(data);
	if (!success){ 
		(function(socket, data){
			socket.once('drain', function() {
				writeData(socket, data);	
			});
		})(socket, data);
	}
}
/*
function get_ip_address(ip_add) {
	var ip_address;

	connection.query('use kanglab_database');
	
	console.log(ip_add);
	console.log(typeof(ip_add));
	connection.query('select ip_address from users where ip_address = ?', ip_add, function(err, rows, fields) {
		if (!err) {
			console.log('The solution is : ', rows);
			// 조건문 ...		
			// 같은 아이피가 2개 이상이거나, 저장되어있는 아이피 주소가 아니던가 등등 
			// 조건 필요!!!

			ipAdd = JSON.stringify(rows[0].ip_address);
			ipAdd = ipAdd.split("\"");
			console.log(rows.length + " : " + ipAdd[1]);
			ip_address=ipAdd[1].toString();	

		} else {
			throw err;
			connection.end();		
		}
	});
	return ip_address;
}*/
/*
// 데이터베이스에서 ip 주소 얻는 함수 
function get_ip_address(ip_add) {

	var get_ipAdd;
	
	//get_ipAdd = JSON.parse(get_ipAdd);
	get_ipAdd = ip_add.split("\:");
	
	var split_get_ipAdd = get_ipAdd[3].toString();
	
	
	console.log(split_get_ipAdd);
	console.log(typeof(split_get_ipAdd));
	
	connection.query('use kanglab_database');
	
	connection.query('select ip_address from users where ip_address = ?', split_get_ipAdd, function(err, rows, fields) {
		if (!err) {
		
			console.log('The solution is : ', rows);
			// 조건문 ...		
			// 같은 아이피가 2개 이상이거나, 저장되어있는 아이피 주소가 아니던가 등등 
			// 조건 필요!!!

			ipAdd = JSON.stringify(rows[0].ip_address);
			ipAdd = ipAdd.split("\"");
			console.log(rows.length + " : " + ipAdd[1]);
			var get_ip_address	= ipAdd[1];	// type : string 
					
		} else {
			throw err;
			connection.end();		
		}
	});
	return get_ip_address;
}
*/
/*
setTimeout(function() {
	sys.puts('world');
}, 2000); // 4s
*/

