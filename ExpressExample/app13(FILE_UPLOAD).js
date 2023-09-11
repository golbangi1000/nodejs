const express = require('express');
const http = require('http');

const static = require('serve-static');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const expressSession = require('express-session');
const multer = require('multer');
const fs = require('fs');//파일이랑 관련된건 fs
const cors = require('cors');
const { type } = require('os');



const app = express();



app.set('port', process.env.PORT || 3000);
//미리 만들어진 미들웨어를 쓰기 static 미들웨어
//이렇게 /public 앞에 붙히면 앞에 public을 쳐야됨 뺴면 안침
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

//body parser 대신 express씀 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));


app.use(cors());

//업로드 관련 저장 관련  multer------------------------------------------------
const storage =  multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        // callback(null, file.originalname + Date.now)  
        //확장자명까지 살릴려면
        const extension = path.extname(file.originalname)
        const baseName = path.basename(file.originalname, extension);
        callback(null, baseName + Date.now()+ extension);
    }
});

//업로드 관련 
var upload = multer({
    storage: storage,
    limits:{
        files:10,
        fileSize: 1024*1024*1024
    }
});

var router = express.Router();

router.route('/process/photo').post(upload.array('photo',1),function(req,res){
    console.log('/process/photo 라우팅 함수 호출됨');

    var files = req.files;
    console.log(typeof(files));
    console.log('==== 업로드된 파일==== ');
    if(files.length > 0){
        console.dir(files[0]);
    } else{
        console.log('파일이 없습니다');
    }


    var originalname;
    var filename;
    var mimetype;
    var size;
    if(Array.isArray(files)){
        for(let i = 0; i < files.length; i++){
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
                        //content타입 헤더 값  : : 
    res.writeHead('200', {"Content-Type": "text/html;charset=utf-8"});
    res.write("<h1>파일 업로드 성공</h1>")
    res.write("<p>원본파일 :" + originalname+ "</p>");
    res.write("<p>저장파일 : " + filename + "</p>");
    res.end();


});


router.route('/process/product').get(function (req, res) {
    console.log('/process/product 라우팅 함수 호출됨')

    if (req.session.user) {
        res.redirect('/public/product.html')
    } else {
        res.redirect('/public/login2.html')
    }

});


router.route('/process/login').post(function (req, res) {
    console.log('/process/login 라우팅 함수 요청됨')

    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ' , ' + paramPassword);


    if (req.session.user) {
        console.log('이미 로그인되어있습니다');

        res.redirect('/public/product.html')
    } else {
        req.session.user = {
            id: paramId,
            name: '소녀시대',
            authorized: true
        };


        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write('<h1>로그인성공</h1>')
        res.write('<p>id : ' + paramId + '</p>');
        res.write('<br><br><a href="/public/product.html"> 상품페이지로 이동하기</a>');
        res.end();
    }

});


router.route('/process/logout').get(function (req, res) {
    console.log('/process/logout 라우팅함수 호출됨 ')

    if (req.session.user) {
        console.log('로그아웃 합니다');

        req.session.destroy(function (err) {
            if (err) {
                console.log('세션 삭제시 에러발생')
                return;
            }


            console.log('세션 삭제 성공');
            res.redirect('/public/login2.html');
        });
    } else {
        console.log('로그인되어 있지 않습니다')
        res.redirect('/public/login2.html');

    }
});




router.route('/process/setUserCookie').get(function (req, res) {
    console.log('/process.setUserCookie 라우팅 함수 호출됨');

    res.cookie('user', {
        id: 'mike',
        name: '소녀시대',
        authorized: true
    });

    res.redirect('/process/showCookie');
});


router.route('/process/showCookie').get(function (req, res) {
    console.log('/process/showCookie 라우팅 함수 호출됨')

    res.send(req.cookies);
});





router.route('/process/login').post(function (req, res) {
    console.log('/process/login 라우팅함수에서 받음.')

    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;


    res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    res.write("<h1>서버에서 로그인 응답</h1>")
    res.write("<div><p>" + paramId + " </p></div>")
    res.write("<div><p>" + paramPassword + " </p></div>")
    res.end();

});


app.use('/', router);


app.all('*', function (req, res) {
    res.status(404).send('<h1>요청하는 페이지는 없다</h1>')
});


app.use(function (req, res, next) {
    console.log('첫번째 미들웨어 호출됨');

    const userAgent = req.header('User-Agent');
    const paramID = req.body.id || req.query.id;


    res.send('<h3>서버에서 응답 : User-Agent:' + userAgent + '</h3>'
        + '<h3> Param ID -> ' + paramID + '</h3>');

});




const server = http.createServer(app).listen(app.get('port'), function () {
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
})