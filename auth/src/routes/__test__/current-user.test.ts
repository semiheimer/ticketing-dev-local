import request from "supertest";
import { app } from "../../app";

const userData = {
  email: "test06@gmail.com",
  password: "1234567",
  username: "test06",
  firstname: "findname",
  lastname: "lastname6",
};

it("responds with details about the current user", async () => {
  const cookie = await global.getCookie();

  const response2 = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response2.body.currentUser.email).toEqual("test06@gmail.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

