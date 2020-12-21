import http from 'http';

import config from '@config/config';
import logging from '@config/logging';

import app from './app';

const NAMESPACE = 'Server';

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () =>
  logging.info(NAMESPACE, `Server Running on ${config.server.hostname}:${config.server.port}`)
);
