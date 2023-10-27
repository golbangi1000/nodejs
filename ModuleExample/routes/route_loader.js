
const route_loader = {}

const config = require('../config');

route_loader.init = function(app, router){
    console.log('route_loader.init 호출됨');

    initRoutes(app, router)
}

function initRoutes(app, router){
    console.log('initRoutes 호출됨')

    for ( var i = 0; i < config.route_info.length; i++){
        let curItem = config.route_info[i];

        let curModule = require(curItem.file);
        if(curItem.type){
            router.route(curItem.path).get(curModule[curItem.method]);
        }

    }
}


module.exports = route_loader;