//create a new admin user, use : node create_user.js nickname email password
var app = require('./app/app.js');
var UserService = app.services.UserService;
var args = process.argv.slice(2);
var email = args[1] || 'admin@admin.org';

UserService.create({
            nickname: args[0] || 'admin',
            email: email,
            ip: '127.0.0.1',
            password: args[2] || 'admin',
}).then(function(){
    return app.orm.User.findOne({ where: { email: email } });
}).then(function(user){
    if (user) {
        user.roles = UserService.roles.UPLOADER | UserService.roles.ADMIN | UserService.roles.SUPER_ADMIN | UserService.roles.TAGGER;
        user.diskSpace = 200000;
        return user.save();
    }
    return 1;
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
