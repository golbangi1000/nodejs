const server_port = 3000;
const db_url = 'mongodb://localhost:27017/local';
const db_schemas = [
    {file:'./user_schema', collection: 'users7', schemaName:'UserSchema',
    modelName:'UserModel'}
];
const route_info = [
    {file: './user', path : '/process/login', method: 'login', type:'post' },
    {file: './user', path : '/process/adduser', method: 'addUser', type:'post' },
    {file: './user', path : '/process/listuser', method: 'listUser', type:'post' },
    {file: './user', path : '/process/test1', method: 'test1', type:'post' },

];

module.exports = {
    server_port,
    db_url,
    db_schemas,
    route_info
}