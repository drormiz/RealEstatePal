import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import express from "express";

import ErrorHandler, {
  notFoundError,
} from "../middlewares/error.middleware.js";
import routes from "../routes.js";
import { configSwagger } from "./swagger.js";

const port = process.env.PORT || 3000;
const dirname = path.resolve();

export const expressApp = () => {
  const app = express();
  if (process.env.NODE_ENV === "production") {
    console.log("production mode2");
    app.use(
      cors({
        origin: "https://realestatepal.cs.colman.ac.il",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, 
        allowedHeaders: "Content-Type,Authorization",
        optionsSuccessStatus: 200,
      })
    );
  } else {
    console.log("development mode2"),
      app.use(
        cors({
          origin: "http://localhost:5173", 
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true, 
          allowedHeaders: "Content-Type,Authorization",
        })
      );
  }

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: false }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/", routes);

  configSwagger(app);
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(dirname, "dist")));

    app.get("/*", ({}, res) => {
      res.sendFile(path.join(dirname, "dist", "index.html"));
    });
  }

  app.get("*", notFoundError);
  app.use(ErrorHandler);

  return app;
};
