import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import ErrorHandler, { notFoundError } from '../middlewares/error.middleware.js';
import routes from '../routes.js';
import multer from 'multer';
import path from 'path';
import { configSwagger } from './swagger.js';

const dirname = path.resolve();
const app = express();
const port = process.env.PORT || 3000;

export const expressApp = () => {
 // Enable CORS
// app.use(cors({
//   origin: 'https://node17.cs.colman.ac.il', // Allow only requests from this origin
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow sending cookies and HTTP authentication
//   allowedHeaders: 'Content-Type,Authorization',
//   optionsSuccessStatus: 200
// }));

// Serve static files from the 'dist' directory
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(dirname, 'dist')));
}

app.use(express.static('public'));

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Swagger
configSwagger(app);

// Handle API routes
app.use('/', routes);

// Catch-all route for serving index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(dirname, 'dist', 'index.html'));
});

// Handle 404 errors
app.use(notFoundError);

// Handle other errors with the custom error handler
app.use(ErrorHandler);

if(process.env.NODE_ENV === 'production'){
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

return app;
}