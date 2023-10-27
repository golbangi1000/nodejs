//Express 기본 모듈
// require("dotenv").config();
// import dotenv from 'dotenv';
let dotenv = require('dotenv');
dotenv.config();
// import express from "express";
const express = require('express');
const Router = express.Router;
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

//몽고디비 모듈
//var MongoClient = require("mongodb").MongoClient; 몽구스모듈을 쓰면 이렇게 할 필요 없어서 여긴 주석

//mongoose 모듈
// import { connect, connection, model } from "mongoose";


const mongoose = require('mongoose');

// import { authenticate } from "passport";

// import userSchema from "./database/user_schema.js";
const userSchema = require('./database/user_schema.js')


// import { fileURLToPath } from "url";
const fileURLToPath = require('url');

const database_loader = require('./database/database_loader.js');

// const __dirname1 = fileURLToPath(new URL(".", import.meta.url));
//데이터베이스 객체를 위한 변수
var database; //==connection conn; 과 같음

//데이터베이스 스키마를 위한 변수
var UserSchema;

//데이터베이스 모델을 위한 변수
var UserModel;

//익스프레스 객체 생성
var app = express()

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

//데이터베이스 연결
// function connectDB() {
//   //데이터베이스 연결 정보
//   var databaseUrl = config.db_url;

//   //연결
//   mongoose.connect(config.db_url)
//   .then(() => console.log('connected')) //몽고DB의 정보를 몽구스모듈과 연결해준다.


  // database = mongoose.connection;

  // database.on("open", function () {
  //   //open이라는 내장이벤트 db가 열려있냐

  //   console.log(" 데이터베이스가 연결 되었습니다: " + databaseUrl); //여기까지왔으면 DB연결 성공

  //   UserSchema = createUserSchema(database);
  //   //Model 정의 - 스키마를 정의했으면 Model를 정의해야 함
  //   UserModel = mongoose.model("users3", UserSchema); //users 테이블에 UserSchema를 적용해라

  //   console.log("UserModel 정의함.");
  // });

  // //function자리에 한번에써준것.
  // database.on("error", console.error.bind(console, "몽구스 모듈 에러")); //이렇게 한줄로 써줄수도있다.

  //app객체에 database라고 하는걸 속성으로 넣어줄수있음

// -----------------------------이건 나중에 다시 보고 고쳐야됨 ---------------------------
//   database.on("disconnected", function () {
//     console.log("DB연결이 끊겼습니다 5초후 재연결 합니다.");
//     setInterval(connectDB(), 5000); //디비연결이 끊기면 5초마다 다시 연결하는 함수를 실행
//   });
// app.set("database", database);

// }

// function createUserSchema(database) {
//   database.UserSchema = userSchema.createSchema(mongoose);

//   UserModel = mongoose.model("users3", database.UserSchema);
//   console.log("userMOdel 정의함");
// }
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
//라우터 객체 생성
var router = Router();

router.route("/process/listuser").post(user1.listUser);
//로그인 라우터
router.route("/process/login").post(user1.login);

router.route("/process/addUser").post(user1.addUser);

//라우터 객체 등록
app.use("/", router);

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

