const user = {
    getUser: function(){
        return {id: 'test01', name: '소녀시대'};
    },

    group: {id:'group01', name: '친구'}
};
//Conversely, module.exports = Tiger would be equivalent to export default Tiger.

//module.exports = user;
export default user;

