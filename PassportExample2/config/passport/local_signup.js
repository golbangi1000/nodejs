const localStrategy= require('passport-local').Strategy;

module.exports = new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallBack: true,
  
  }, function(req, email, password, done){
    const paramName = req.body.name || req.query.name;
    console.log('passport의 local signup 호출됨' + email + ', '  + password + ', ' + 
    paramName);
  
    const database = app.get('database');
    database.UserModel.findOne({'email':email}, function(err,user){
      if(err){
        console.log('에러 발생');
        return done(err);
      }
  
      if(user){
        console.log('기존에 계정이 있습니다')
        return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다'));
  
      } else{
        const user  = new database.UserModel({'email':email ,'password':password, 'name':paramName});
        user.save(function(err){
          if(err){
            console.log('데이터베이스에 저장시 에러');
            return done(null, false, req.flash('signupMessage', '사용자 ㅈ어보 저장시  에러가 발생했습니다'))
          }
  
          console.log('사용자 데이터 저장함')
          return done(null, user);
        });
      }
  
    });
  })