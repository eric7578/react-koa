import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import session from 'koa-session';
import passport from 'koa-passport';
import serve from 'koa-static';
import views from 'koa-views';
import Router from 'koa-router';
import {
    renderer,
    routerRenderer
} from './routes/middlewares/react.js';

const app = new Koa();
const router = Router();

app.keys = ['secret'];
app.use(session(app));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser());

// static file serve
// TODO replace with web servers like nginx
app.use(serve(path.join(__dirname, 'public')));

// view engine setup
app.use(views(path.join(__dirname, 'views')));

// development error handler
// will print stacktrace
app.use(errorPage({
    printStack: app.env === 'development'
}));

router.get('/', async function (ctx, next) {
    await ctx.render('index.jade');
});

import auth from './routes/auth.js';
router.use('/auth', auth.routes());

import dashboardRoutes from './react/dashboard/routes.jsx';
router.get('/dashboard/:subDomain?', routerRenderer(dashboardRoutes));

import accountRoutes from './react/account/routes.jsx';
router.get('/account/:subDomain?', routerRenderer(accountRoutes));

app.use(router.routes());

// catch 404 and forward to error handler
app.use(notFound());

function checkLogin () {
    return function (ctx, next) {
        if (ctx.isAuthenticated()) {
            return next();
        } else {
            ctx.redirect('/');
        }
    }
}

function notFound () {
    return function (ctx, next) {
        ctx.throw(404, 'Not found');
    }
}

function errorPage (opt = {}) {
    if (opt.printStack) {
        return async function (ctx, next) {
            try {
                await next();
            } catch (err) {
                await ctx.render('error.jade', {
                    message: err.message,
                    error: err
                });
            }
        }
    } else {
        return async function (ctx, next) {
            try {
                await next();
            } catch (err) {
                await ctx.render('error.jade', {
                    message: err.message,
                    error: {}
                });
            }
        }
    }
}

export default app;
