import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

export const configSwagger = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "RealestatePal app 2023 REST API",
        version: "1.0.1",
        description: "REST server including authentication using JWT and refresh token",
      },
      servers: [{ url: "http://localhost:3000", },],
    },
    apis: ["./src/**/*.js"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};