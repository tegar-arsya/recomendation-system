import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import firebase from './config/firebase.js';
import { specs, swagerUi } from './config/swager.js';
import dotenv from 'dotenv';

// routes
import indexRouter from './routes/index.js';
import seederRouter from './routes/seeders.js';

dotenv.config();

firebase();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', swagerUi.serve, swagerUi.setup(specs));

app.use('/', indexRouter);
app.use('/seeder', seederRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

// ✅ Ekspor sebagai handler agar bisa dijalankan di Vercel
export default app;
