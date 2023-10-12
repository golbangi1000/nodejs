var authUser = function (database, id, password, callback) {
	console.log("authuser 함수 호출");
  
	//--------------------schema static
	UserModel.findById(id).then((result) => {
	  if (result.length > 0) {
		var user = new UserModel({ id: id });
		var authenticated = user.authenticate(
		  password,
		  result[0]._doc.salt,
		  result[0]._doc.hashed_password
		);
  
		if (authenticated) {
		  console.log("비밀번호 일치함 성공");
		  callback(null, result);
		} else {
		  console.log("비밀번호 일치하지않음 실패");
		  callback(null, null);
		}
	  } else {
		console.log("아이디 일치하는 사용자 없음");
		callback(null, null);
	  }
	});
  };

const login = function(req,res){

	console.log("/process/login 호출");

	var id = req.body.id;
	var pwd = req.body.pwd;
                        //app는 또 어딨냐? req에 넣어주면된다
    const database  = req.app.get('database');

	if(database){
		//callback함수가 되는것
		authUser(database, id, pwd, function(err,result){ //위 사용자 인증 함수로 올라감

			if(err) throw err;

			if(result){ //데이터가 있으면

				var userName = result[0].name;//위에서 데이터를 배열로 받기로 했슴
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 성 공 ~ ~</h1>");
				res.write("<div>아이디: " + id + "</div>");
				res.write("<div>이름: " + userName + "</div>");
				res.write("<br><br><a href='/public/login.html'>다시 로그인</a>");
				res.end();

			}else{

				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 실 패 ㅠ-ㅠ</h1>");
				res.write("<div>아이디또는 패스워드를 확인하세요</div>");
				res.write("<br><br><a href='/public/login.html'>다시 로그인</a>");
				res.end();

			}

		});


	}else{

		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>DB연결 실 패 ㅠ-ㅠ</h1>");
		res.write("<div>DB를 연결하지 못했습니다</div>");
		res.end();

	}




};


const addUser = function(req,res){

	console.log("/process/addUser 호출");

	var id = req.body.id;
	var pwd = req.body.pwd;
	var name = req.body.name;
    const database  = req.app.get('database');

	if(database){

		addUser(database,id,pwd,name, function(err,result){ //함수속 매개변수는 사용자 정의

			if(err) throw err;

			if(result){

				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 성공</h1>");
				res.write("<h2>사용자 ID" + id+"이름:"+ name+ "</h2>")
				res.end();


			}else{

				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 실패</h1>");
				res.end();

			}

		});

	}else{

		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>DB연결 실 패 ㅠ-ㅠ</h1>");
		res.write("<div>DB를 연결하지 못했습니다</div>");
		res.end();

	}

};


const listUser = function(req,res){
    console.log('/process/listure 라우팅함수 호출됨');
    const database  = req.app.get('database');

	//집에서 해보기
    if(database){
        database.UserModel.findAll(function(err,results){
            if(err){
                console.log('에러발생')
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러발생</h1>')
                res.end();
                return;
            }

            if(results){
                console.dir(results);

                res.writeHead(  200, {"Content-type:": "text/html;charset=utf8"})
                res.write("<h3>사용자 리스트</h3>")
                res.write("<div><ul>");

                for(var i = 0; i < results.length; i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write(" <li>#" + i + " -> " + curId + ", " + curName+ "</li>" )

                }

                res.write("</ul></div>")
                res.end();
            } else {
                console.log('에러발생')
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음</h1>')
                res.end();
            }
        });
    } else{
        console.log('에러발생');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write("<h1>데이터베이스 연결 안됨</h1>");
        res.end();
    }

}

export {login,addUser,listUser};

