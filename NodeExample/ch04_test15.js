let winston = require('winston');

let winstonDaily = require('winston-daily-rotate-file')

//날짜를 년도만 빼네고 뭐만 빼네고 하고싶을떄
let moment = require('moment');


function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

let logger =  winston.createLogger({
    transports: [
        new (winstonDaily)({
            name:'info-file',
            dirname : './log',
            filename:'boom.log',
            datePattern:'YYYY-MM-DD-HH',
            colorize:false,
            maxsize:50000000,
            maxFiles:1000,
            level:'info',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat,
        }),
        new (winston.transports.Console)({
            name:'debug-console',
            colorize:true,
            level:'debug',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat,
        })
    ]
});




logger.debug('디버그 메시지 입니다');
logger.error('에러 메시지 입니다');

