//Express 기본 모듈
// require("dotenv").config();
// import dotenv from 'dotenv';
let dotenv = require('dotenv');
dotenv.config();
// import express from "express";
const express = require('express');
const router1 = express.Router;
const urlencoded = express.urlencoded;
// import  http from "http";
const http = require('http');

const createServer = http.createServer;
// import path from "path";

const path = require('path');


// import * as config from './config.js';
const config = require('./config.js')


//var bodyParser = require("body-parser"); //예전에는 bodyParser를 호출해야 했지만 express에 내장이 되어 안써도 괜춘
// import serveStatic from "serve-static"; //특정 폴더를 패스로 접근 가능하게 하는것.
const serveStatic = require('serve-static');
// import expressErrorHandler from "express-error-handler";
const expressErrorHandler = require('express-error-handler');


//-----------------------암호화 모듈-------------------------------------------
// import crypto from "crypto";
const crypto = require('crypto');

// import expressSession from "express-session";
const expressSession = require('express-session');

// import {addUser1,listUser1,login1} from './routes/user.js';
// import * as user1 from "./routes/user.js";

const user1 = require('./routes/user.js');


const mongoose = require('mongoose');

// import { authenticate } from "passport";

// import userSchema from "./database/user_schema.js";
const userSchema = require('./database/user_schema.js')


const fileURLToPath = require('url');

const database_loader = require('./database/database_loader.js');

const router_loader = require('./routes/route_loader.js');
const route_loader = require('./routes/route_loader.js');


/// -------------------passport---------------------

const passport = require('passport');
const flash = require('connect-flash');


// const __dirname1 = fileURLToPath(new URL(".", import.meta.url));
//데이터베이스 객체를 위한 변수
var database; //==connection conn; 과 같음

//데이터베이스 스키마를 위한 변수
var UserSchema;

//데이터베이스 모델을 위한 변수
var UserModel;

//익스프레스 객체 생성
var app = express()

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

console.log('config.server_port ->' + config.server_port)
app.set("port", config.server_port || 3000);


app.use(urlencoded({ extended: false }));


app.use("/public", serveStatic(path.join(__dirname, "public"))); //public (실제)폴더의 이름을 써준것
//사용자정의

app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

//작업하는 함수를 만들고 그걸 불러쓰는 라우터를 만듬.
//사용자를 인증하는 함수
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

//사용자를 추가하는 함수
var addUser = function (database, id, pwd, name, callback) {
  console.log("addUser 함수 호출");

  var users = new UserModel({ id: id, password: pwd, name: name });


  users
    .save()
    .then((result) => {
      console.dir(result);
      console.log(result);
      if (result) {
        console.log("사용자 추가됨");
        callback(null, users);
      } else {
        console.log("사용자 추가 실패");
      }
    })
    .catch((err) => {
      callback(err, null);
      return;
    });
};

//-----------------------------------------------------------------------------


//----------passport 초기화 ---------------------
//express서버에 middleware 등록 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// =============패스포트 strategy 설정 ===================
const localStrategy = require('passport-local').Strategy;

passport.use('local-login',new localStrategy({
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

}));


passport.use('local-signup', new localStrategy({
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
}))


passport.serializeUser( function(user, done){
  console.log('serializeUser 호출됨');
  console.dir(user);

  done(null,user);
});


passport.deserializeUser(function(user, done){
  console.log('deserializeUser 호출됨, ');
  console.log(user);

  done(null, user);
})
//라우터 객체 생성
const router = express.Router();
route_loader.init(app, router);

//=============회원가입과 로그인 라우팅 함수====================
router.route('/').get(function(req, res){
  console.log('/ path로 요청됨 ')

  res.render('index.ejs')
});

router.route('/login').get(function(req,res){
  console.log('/login path로 요청됨')

  res.render('login.ejs', {message: req.flash('loginMessage')});


});

router.route('/login').post(passport.authenticate('local-login',{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.route('/signup', function(req,res){
  console.log('/signup 패스로 GET 요청됨');

  res.render('signup.ejs' ,{message: req.flash('signupmessage')})
});


router.route('/signup').post(passport.authenticate('local-signup',{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}))


router.route('/profile').get(function(req,res){
  console.log('/profile 패스로 GET 요청됨.');

  console.log('req.user 객체 정보 ');

  console.dir(req.user);

  if(!req.user){
    console.log('사용자 인증 안된 상태임');
    res.redirect('/');

  } else{
    console.log('사용자 인증된 상태임');

    if(Array.isArray(req.user)){
      res.render('profile.ejs', {user:req.user[0]._doc})

    } else{
      res.render('profile.ejs', {user: req.user});
    }

  }
});

router.route('/logout').get(function(req,res){
  console.log('/logout 호출됨');

  req.logout();
  res.redirect('/');

})




var errorHandler = expressErrorHandler({
  static: {
    //미리 메모리상에 올려둔것
    404: "./DatabaseExample/public/404.html", //404에러가 뜨면 public에 404.html로 가라
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler); //변수명 담아줌

//Express 서버 시작
//var server = http.createServer();

createServer(app).listen(app.get("port"), function () {
  //위에 set으로 넣어둔 port를 get으로 가져온거

  console.log("익스프레스 서버 on~~ 포트번호는:" + app.get("port"));

  //DB연결 함수 호출
  database_loader.database.init(app, config);
  
});

