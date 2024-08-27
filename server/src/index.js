import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import { expressApp } from './config/express.js';
import http from 'http'
import https from "https";
import fs from "fs";
import path from "path";

const port = process.env.PORT || 3000;
const dirname = path.resolve();

connectToDatabase()
    .then(()=> {
        const app = expressApp();

        if (process.env.NODE_ENV !== "production") {
            console.log("development mode");
            http.createServer(app).listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
        } else {
            console.log("production mode");
         
          http.createServer(app).listen(process.env.PORT, () => {
            console.log(`server listening on port ${process.env.PORT}`);
          });
        }

        
    })
    .catch(error => {
        console.log(error);
    });