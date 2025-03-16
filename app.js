import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs'; // Tambahkan ini
import path from 'path';
import { fileURLToPath } from 'url';
import firebase from './config/firebase.js';
import { swagerUi } from './config/swager.js';
import dotenv from 'dotenv';
import yaml from 'yaml';

// routes
import indexRouter from './routes/index.js';
import seederRouter from './routes/seeders.js';
import recomendationSyestemRouter from './routes/recomendation_system.js';

dotenv.config();

firebase();

var app = express();
// Dapatkan path absolut ke file swager.yaml
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swagerFilePath = path.resolve(__dirname, './config/swager.yaml');

// Baca file swager.yaml
const fileSwager = fs.readFileSync(swagerFilePath, 'utf-8');

const swagerDocument = yaml.parse(fileSwager);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', swagerUi.serve, swagerUi.setup(swagerDocument));

app.use('/', indexRouter);
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

export default app;
