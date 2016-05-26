import Router from 'koa-router';
import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';

const router = Router();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//local strategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, done) {
    if (username === 'admin' && password === 'password') {
        done(null, { username, loginTime: new Date() });
    } else {
        done(new Error('Invalid username/password'));
    }
}));

router.get('/logout', function (ctx, next) {
    ctx.logOut();
    ctx.redirect('/');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}), function (ctx, next) {
    ctx.logIn();
});

export default router;
