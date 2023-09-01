let url = require('url');
//url 객체 

let urlStr = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=popcorn';


//현재의 url 객체를 얘기하는거다 
let  curUrl = url.parse(urlStr);

console.dir(curUrl); // 1

console.log('query ->' + curUrl.query); // 2

let curStr = url.format(curUrl);

console.log('url -> ' + curStr); // 3


let querystring = require('querystring');

querystring.parse(curUrl.query);
//안에 있는걸 parse로 또 분리 
let params = querystring.parse(curUrl.query);

console.log('-----------------------')
console.log(params);
console.log('검색어 : ' + params.query);