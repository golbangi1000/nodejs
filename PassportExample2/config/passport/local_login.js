module.exports = new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,
  }, function(req,email, password,done){
    console.log('passport의 local-login 호출됨. :' + email +  ', ' + password);
  
    const database = app.get('database');
    database.UserModel.findOne({'email': email}, function(err,user){
      if(err){
        return done(err);
      } 
  
      if (!user){
        console.log('사용자 정보가 일치하지 않습니다');
        return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다'));  
      }
  
      const authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
      if(!authenticated){
        console.log('비밀번호가 일치하지 않습니다');
        return done (null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다'));
  
      }
  
      console.log('아이디와 비밀번호가 일치합니다')
      return done(null, user);
  
    });
  
  });