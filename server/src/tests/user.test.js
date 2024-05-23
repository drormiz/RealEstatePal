import request from "supertest";
import { initApp } from "../../app";
import { UserModel } from "../models/user.model";
import mongoose from "mongoose";


let app;
let accessToken;
let userId;
const user = {
  email: "test@test.com",
  password: "1234567890",
  username: 'test',
  name: 'test',
  passwordConfirmation: '1234567890',
  image:''
}

const updatedUser = {
    email: "test@test.com",
    password: "1234567890",
    username: 'testtt',
    name: 'testtt',
    passwordConfirmation: '1234567890',
    image:''
  }

const loginUser = {
    username: 'test',
    password: "1234567890"
}

beforeAll(async () => {
    app = await initApp();
    await UserModel.deleteMany({ 'email': user.email });
    const registerResponse = await request(app).post("/auth/register").send(user);
    userId = registerResponse.body._id;
    const loginResponse = await request(app).post("/auth/login").send(loginUser);    
    accessToken = loginResponse.body.accessToken;
  }, 60000);

  afterAll(async () => {
    await mongoose.connection.close();
  });
  
describe("User tests", () => {
  const updateUser = async () => {
    const response = await request(app).put(`/api/users/${userId}`)
      .set("Authorization", "bearer " + accessToken)
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
  };
  test("Test Get All users", async () => {
    const response = await request(app).get("/api/users").set("Authorization", "bearer " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test update user", async () => {
    const response = await request(app).get("/api/users").set("Authorization", "bearer " + accessToken);
    userId = response.body[0]._id;
    updateUser();
  });

  test("Test Get All users with one user in DB", async () => {
    const response = await request(app).get("/api/users").set("Authorization", "bearer " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const userFetched = response.body[0];
    expect(userFetched.username).toBe(updatedUser.username);
  });

  test("Test DELETE /user/:id", async () => {
    const response = await request(app).delete(`/api/users/${userId}`)
    .set("Authorization", "bearer " + accessToken);;
    expect(response.statusCode).toBe(200);
  });
});