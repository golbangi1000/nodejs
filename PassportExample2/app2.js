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
const config = require('./config/config.js')


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


// ====================socket io and cors==============

const socketio = require('socket.io');
const cors = require('cors');




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

//=============cors 초기화 ===================
app.use(cors());


//----------passport 초기화 ---------------------
//express서버에 middleware 등록 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const configPassport  = require('./config/passport');

const userPassport = require('./routes/user_passport')

userPassport(router , passport);


const localStrategy = require('passport-local').Strategy;




//라우터 객체 생성
const router = express.Router();
route_loader.init(app, router);





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

//=========socket.io서버 시작==============
const io = socketio.listen(server);
console.log('socketio 요청을 받아들일 준비가 완료됨')

io.sockets.on('connection', function(socket){
  console.log('connection info-> '+ socket.request.connection._peername);

  socket.remoteAddress = socket.request.connection._peername.address;
  socket.remotePort = socket.request.connection._peername.port;
  

  socket.on('message', function(message){
    console.log('message 받음 -> ' + JSON.stringify(message));
  
    if (message.recepient == 'ALL'){
      console.log('모든 클라이언트에게 메세지 전송함');

      io.sockets.emit('message',message);
    }
  });



});

