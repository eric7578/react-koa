import path from 'path';
import React from 'react';
import {
    RouterContext,
    match
} from 'react-router';
import { renderToString } from 'react-dom/server';
import Router from 'koa-router';

export function renderer (component, opt = {
    template: 'default.jade',
    bundle: ''
}) {
    return async function (ctx, next) {
        opt.reactContent = renderToString(component);
        await ctx.render(opt.template, opt);
    }
}

export function routerRenderer (routes, opt = {
    template: 'default.jade',    // template name
    bundle: ''                   // default js bundle name
}) {
    function checkIfRouteMatch (request) {
        opt.bundle = opt.bundle || `${request.url.slice(1)}.bundle`;
        return new Promise(function (resolve, reject) {
            match({
                routes,
                location: request.originalUrl
            }, function (error, redirectLocation, renderProps) {
                resolve([error, redirectLocation, renderProps]);
            });
        });
    }

    return async function (ctx, next) {
        const [error, redirectLocation, renderProps] = await checkIfRouteMatch(ctx.request);
        if (error) {
            ctx.throw(error);
        } else if (redirectLocation) {
            ctx.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            opt.reactContent = renderToString(<RouterContext {...renderProps} />);
            await ctx.render(opt.template, opt);
        } else {
            next();
        }
    }
}
