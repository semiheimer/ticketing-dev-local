import request from "supertest";
import { app } from "../../app";

const createTicket = async () => {
  const cookie = await global.signin();
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "asldkf",
    price: 20,
  });
};

it("can fetch a list of tickets", async () => {
  let response: any = "";
  response = await createTicket();
  response = await createTicket();
  response = await createTicket();

  response = await request(app).get("/api/tickets").send();
  expect(response.body.length).toEqual(3);
});

