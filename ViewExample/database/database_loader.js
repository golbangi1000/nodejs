const { default: mongoose } = require("mongoose");


let database = {};

database.init = function(app, config){
    console.log('init 호출됨');
    connect(app,config);
}


function connect (app, config){
    console.log('connect 호출됨');


    database.db = mongoose.connection;

    database.db.on("open", function () {
      //open이라는 내장이벤트 db가 열려있냐
  
      console.log(" 데이터베이스가 연결 되었습니다: " + databaseUrl); //여기까지왔으면 DB연결 성공
  
      UserSchema = createSchema(database);
      //Model 정의 - 스키마를 정의했으면 Model를 정의해야 함
      UserModel = mongoose.model("users3", UserSchema); //users 테이블에 UserSchema를 적용해라
  
      console.log("UserModel 정의함.");
    });
  
    //function자리에 한번에써준것.
    database.db.on("error", console.error.bind(console, "몽구스 모듈 에러")); //이렇게 한줄로 써줄수도있다.
    
    database.db.on('disconnected', function(){
      console.log('데이터베이스 연결 끊어짐 ')
    })
}


function createSchema(app, config){
  for( let i = 0; i < config.db_schemas.length ; i++){
    let curItem = config.db_schemas[i];

    const curSchema = require(curItem.file).createSchema(mongoose);
    console.log('%s 사용' , curItem.file);

    mongoose.model(curItem.collection, curSchema);
    console.log('%s 컬렉션을 위해 모델 정의함' );
    
    database[curItem.modelName] = curModel;
    console.log('스키마 [%s] 모델 [%s] 생성됨', curItem.schemaName,curItem.modleName);
  }

  app.set('database',database);
}

module.exports = {
  database
}

