import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

import config from '@config/config';
import logging from '@config/logging';
import apiRouter from '@routes/routes';

const NAMESPACE = 'App';
const app = express();

mongoose
  .connect(config.mongo.uri, config.mongo.options)
  .then(() => logging.info(NAMESPACE, 'Connected to mongoDB!'))
  .catch((err) => logging.error(NAMESPACE, err.message, err));

app.use((req, res, next) => {
  logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
  res.on('finish', () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    );
  });
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
    return res.status(200).json({});
  }
  next();
});

app.use('/api', apiRouter);

app.use((req, res) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});

export default app;
