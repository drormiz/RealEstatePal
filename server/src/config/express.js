import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';

import ErrorHandler, {
  notFoundError,
} from '../middlewares/error.middleware.js';
import routes from '../routes.js';
import { configSwagger } from './swagger.js';

const port = process.env.PORT || 3000;
const dirname = path.resolve();

export const expressApp = () => {

  const app = express();
  app.use(cors({
    origin: 'http://realestatepal.cs.colman.ac.il', // Allow only requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow sending cookies and HTTP authentication
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200
  }));

  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: false }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', routes);

  configSwagger(app);

  app.use(express.static(path.join(dirname, 'dist')));

  app.get('/*', ({}, res) => {
    res.sendFile(path.join(dirname, 'dist', 'index.html'));
  });

  app.get('*', notFoundError);
  app.use(ErrorHandler);

  return app;
};
