import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("has a route handler listening to /api/tickets for get requests", async () => {
  const response = await request(app).get("/api/tickets/asda").send({});

  expect(response.status).not.toEqual(404);
});

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  let response: any = "";

  response = await request(app)
    .get(`/api/tickets/asdasdasd`)
    .send()
    .expect(400);
  console.log("🚀 ~ it ~ response:", response.StatusCodes);
  response = await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

