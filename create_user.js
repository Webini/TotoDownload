//create a new admin user, use : node create_user.js nickname email password
var app = require('./app/app.js');
var UserService = app.services.UserService;
var args = process.argv.slice(2);

UserService.create({
            nickname: args[0] || 'admin',
            email: args[1] || 'admin@admin.org',
            ip: '127.0.0.1',
            roles: UserService.roles.UPLOADER | UserService.roles.ADMIN | UserService.roles.SUPER_ADMIN | UserService.roles.TAGGER,
            password: args[2] || 'admin',
            diskSpace: 200000
}).then(
    function(ok){
        console.log('User created');
        process.exit(0);
    },
    function(err){
        console.log('errror', err)
        process.exit(1);
    }
);                            
