import { initApp } from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import { UserModel } from "../models/user.model";

let app;
let accessToken;

const user = {
    email: "test@test.com",
    password: "1234567890",
    username: 'test',
    name: 'test',
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
    const loginResponse = await request(app).post("/auth/login").send(loginUser);    
    accessToken = loginResponse.body.accessToken;
  }, 60000);


afterAll(async () => {
    await mongoose.connection.close();
});

describe("File Tests", () => {
    test("upload file", async () => {
            const response = await request(app)
            .post('/api/file').set("Authorization", "Bearer " + accessToken)
            .attach('image', Buffer.from(''), {
              filename: 'test-image.jpg',
              contentType: 'image/jpeg',
            });
            expect(response.status).toBe(200);
            let url = response.body.imageUrl;
            url = url.replace(/^.*\/\/[^/]+/, '');
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
    })
})