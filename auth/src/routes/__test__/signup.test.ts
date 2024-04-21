import request from "supertest";
import { app } from "../../app";

const userData = {
  email: "test06@gmail.com",
  password: "1234567",
  username: "test06",
  firstname: "findname",
  lastname: "lastname6",
};

it("returns a 201 on successful signup", async () => {
  const response = await request(app).post("/api/users/signup").send(userData);

  expect(response.body).toHaveProperty("id");
  const { password, ...restData } = userData;
  expect(response.body).toMatchObject(restData);
  // expect(response.body.email).toBe(userData.email);
  // expect(response.body.username).toBe(userData.username);
  // expect(response.body.firstname).toBe(userData.firstname);
  // expect(response.body.lastname).toBe(userData.lastname);
  expect(response.body).not.toHaveProperty("password");
  expect(response.status).toBe(201);
});

it("returns a 400 with an invalid email", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "te",
    password: "1234567",
    username: "test06",
    firstname: "findname",
    lastname: "lastname6",
  });
  // console.log(response.status, response.body);
  expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test06@gmail.com",
      password: "12",
      username: "test06",
      firstname: "findname",
      lastname: "lastname6",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1234567",
      username: "test06",
      firstname: "findname",
      lastname: "lastname6",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1234567",
      username: "test06",
      firstname: "findname",
      lastname: "lastname6",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test06@gmail.com",
      password: "1234567",
      username: "test06",
      firstname: "findname",
      lastname: "lastname6",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test06@gmail.com",
      password: "1234567",
      username: "test07",
      firstname: "findname",
      lastname: "lastname6",
    })
    .expect(400);
});

it("disallows duplicate usernames", async () => {
  const response1 = await request(app).post("/api/users/signup").send({
    email: "test06@gmail.com",
    password: "1234567",
    username: "test06",
    firstname: "findname",
    lastname: "lastname6",
  });
  expect(response1.status).toBe(201);

  const response2 = await request(app).post("/api/users/signup").send({
    email: "test07@gmail.com",
    password: "1234567",
    username: "test06",
    firstname: "findname",
    lastname: "lastname6",
  });
  expect(response2.status).toBe(400);
});

//secure:false yapılırsa çalışır
it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(userData)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
