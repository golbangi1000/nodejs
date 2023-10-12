import crypto from "crypto";

var Schema = {};

Schema.createSchema = function (mongoose) {
  console.log("createSchema 호출됨");
  //스키마 정의
  var UserSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true, default: "" },
    hashed_password: { type: String, require: true, default: "" },
    salt: { type: String, reqruired: true },
    name: { type: String, index: "hashed", default: "" },
    age: { type: Number, default: -1 },
    created_at: { type: Date, index: { unique: false }, default: Date.now() },
    updated_at: { type: Date, index: { unique: false }, default: Date.now() },
  });

  console.log("UserSchema 정의함.");

  UserSchema.virtual("password")
    //파라미터로 password라는것을 받고
    .set(function (password) {
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
      console.log("virtual password 저장됨" + this.hashed_password);
    });

  UserSchema.method("encryptPassword", function (plainText, inSalt) {
    if (inSalt) {
      //-----------------sha1알고리즘과 digest 알고리즘
      //salt값은 일종의 시드값 같은거
      return crypto.createHmac("sha1", inSalt).update(plainText).digest("hex");
    } else {
      return crypto
        .createHmac("sha1", this.salt)
        .update(plainText)
        .digest("hex");
    }
  });

  //makeSalt는 특정한값을 랜덤하게 만드는거 결국에는 매번 salt를 사용하면 새로운값이 만들어지겠지
  UserSchema.method("makeSalt", function () {
    // + ''이건 문자열 변화용
    return Math.round(new Date().valueOf() * Math.random()) + "";
  });

  UserSchema.method(
    "authenticate",
    function (plainText, inSalt, hashed_password) {
      if (inSalt) {
        console.log("authenticate 호출됨");
        return this.encryptPassword(plainText, inSalt) === hashed_password;
      } else {
        console.log("authenticate 호출됨");
        return this.encryptPassword(plainText) === hashed_password;
      }
    }
  );
  // UserSchema.static('findById', function(id, callback){
  //     return this.find({id:id}, callback);
  // });

  UserSchema.static("findById", async function (id) {
    const user = await this.find({ id: id });
    return user;
  });

  //이런
  UserSchema.static("findAll", async function () {
    return this.find({});
  });

  return UserSchema;
};

export default Schema;
