        
        
        
        
        
        UserSchema.static('findById', function(id, callback){
            return this.find({id:id}, callback);
        });


        UserSchema.static('findById', async function(id) {
            const user = await this.find({id:id});
            return user;
          });
          
          
    var authUser = function(database,id,pwd,callback){ 
	UserModel.find({"id":id,"password":pwd})
	.then(result => {
		if(result.length>0){
			callback(null,result)
		} else{
			console.log(result);
			console.dir(result);
			console.log('일치하는 데이터가 없습니다');
			callback(null,null)
		}
	})
	.catch((err) =>{
		callback(err,null);
		return
	})
    }
        
        
        
        
          var authUser = function(database,id,pwd,callback){ 

            console.log("authuser 함수 호출");
        
            UserModel.findById(id){
                if(err){
                    callback(err,null)
                    return
                }
        
                console.log('아이디 %s로 검색됨.')
                if(results.length> 0){
                    if(results[0]._doc.password === pwd){
                        console.log('비밀번호 일치함');
                        callback(null,results);
                    } else{
                        console.log('비밀번호 일치하지않음')
                        callback(null,null);
                    }
                } else {
                    console.log('아이디 일치하는 사용자 없음')
                    callback(null,null);
                }

                //----------schema static 답
                .then(result => {
                    if(result.length>0){
                        if(results[0]._doc.password === pwd){
                            console.log('비밀번호 일치함');
                            callback(null,results);
                        } else{
                            console.log('비밀번호 일치하지않음')
                            callback(null,null);
                        }
                    } else {
                        console.log('아이디 일치하는 사용자 없음')
                        callback(null,null);
                    }
                    
                })
                .catch((err) =>{
                    callback(err,null);
                    return
                })
    


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
