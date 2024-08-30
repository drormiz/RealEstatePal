import "dotenv/config";
import { connectToDatabase } from "./config/db.js";
import { expressApp } from "./config/express.js";
import http from "http";
import fs from "fs";
import path from "path";
import https from "https";

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";
const dirname = path.resolve();

connectToDatabase().then(() => {
  const app = expressApp();
  if (process.env.NODE_ENV !== "production") {
    console.log("development mode");
    http.createServer(app).listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}, host: ${host}, port: ${port}`);
    });
  } else {
    console.log("production mode");
    const options = {
        key: fs.readFileSync(path.join(dirname, "./cert/myserver.key")),
        cert: fs.readFileSync(path.join(dirname, "./cert/CSB.crt")),
    };
    https.createServer(options, app).listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}, host: ${host}, port: ${port}`);
    });
  }
}).catch(error => {
  console.log(error);
});
