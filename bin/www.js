import app from '../app.js';

const port = normalizePort(process.env.PORT || '3000');
app.listen(port);

// Normalize port to number which is larger than zero
function normalizePort (val) {
    let port = parseInt(val, 10);
    return (!isNaN(port) && port > 0) ? port : false;
}
