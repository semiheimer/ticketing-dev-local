import request from "supertest";
import { app } from "../../app";

const userData = {
  email: "test06@gmail.com",
  password: "1234567",
  username: "test06",
  firstname: "findname",
  lastname: "lastname6",
};

it("clears the cookie after signing out", async () => {
  await request(app).post("/api/users/signup").send(userData).expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  );
});

