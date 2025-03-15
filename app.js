import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import firebase from './config/firebase.js';
import {swagerUi} from './config/swager.js';
import dotenv from 'dotenv'; // Menggunakan dotenv untuk memuat variabel lingkungan
import fs from 'fs'
import yaml from 'yaml'
import http from 'http';

// routes
import indexRouter from './routes/index.js';
import seederRouter from './routes/seeders.js';
import recomendationSyestemRouter from './routes/recomendation_system.js';

dotenv.config();

firebase();

var app = express();
const fileSwager = fs.readFileSync('./config/swager.yaml', 'utf-8')
const swagerDocument = yaml.parse(fileSwager)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', swagerUi.serve, swagerUi.setup(swagerDocument));

app.use('/', swagerUi.serve, swagerUi.setup(swagerDocument));
app.use('/seeder', seederRouter);
app.use('/recomendation_system', recomendationSyestemRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Setup server
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log(`Listening on ${bind}`);
}

export default app; 
