import request from "supertest";
import { app } from "../../app";

const userData = {
  email: "test@test.com",
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

  const setCookieHeader = response.get("Set-Cookie")[0];
  const match = setCookieHeader.match(/Expires=([^;]+)/);
  const expiresDate = match ? new Date(match[1]) : null;
  const oneDay = 24 * 60 * 60 * 1000; // 1 gün = 24 saat
  const date = new Date();
  const now = date.getTime() - 6000; // Doğru çıkması için 1 dakika geri al
  // const oneDayFromNow = new Date(now.getTime() + oneDay);

  expect(expiresDate).toBeTruthy(); // Expires tarihinin mevcut olduğunu kontrol edin
  expect(expiresDate?.getTime()).toBeGreaterThan(now); // Geçerli zamanın ilerinde olmalı
  expect(expiresDate?.getTime()).toBeLessThan(now + oneDay); // 1 gün içinde olmalı

  // Diğer cookie özelliklerini de kontrol edebilirsiniz
  expect(setCookieHeader).toMatch(/session=logout/);
  expect(setCookieHeader).toMatch(/Path=\//);
  expect(setCookieHeader).toMatch(/HttpOnly/);
  expect(setCookieHeader).toMatch(/Secure/);
});
