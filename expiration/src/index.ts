import { natsConnection } from "./nats-connection";

async function startServer() {
  await natsConnection();
}

startServer();

