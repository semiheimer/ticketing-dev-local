import request from "supertest";
import { app } from "../../app";

const userData = {
  email: "test06@gmail.com",
  password: "1234567",
  username: "test06",
  firstname: "findname",
  lastname: "lastname6",
};

it("fails when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(401);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app).post("/api/users/signup").send(userData).expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test06@gmail.com",
      password: "aslkdfjalskdfj",
    })
    .expect(401);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app).post("/api/users/signup").send(userData).expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test06@gmail.com",
      password: "1234567",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

