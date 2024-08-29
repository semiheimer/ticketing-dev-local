import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import { NotFoundError, currentUser, errorHandler } from "@semiheimerco/common";
import { createChargeRouter } from "./routes/new";

const app = express();
/*
trust proxy tells Express to trust the proxy (e.g., Nginx or a cloud 
provider's load balancer) to pass along information like the client's 
IP address, protocol (HTTP/HTTPS), etc.
When this is set to true, Express will use the headers provided by the
 proxy to determine the original request’s information, such as 
 X-Forwarded-For (for the client's IP) or X-Forwarded-Proto 
 (for the protocol, HTTP/HTTPS).
 Client IP Address: Normally, without a proxy, Express can read the client’s 
 IP address directly from the request. When behind a proxy, however, 
 the server might see the proxy's IP address instead of the client’s. 
 Setting 'trust proxy' allows Express to read the actual client IP from 
 the X-Forwarded-For header.
*/

app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cookieSession({
//     signed: false,
//     //secure: true, // for https
//     secure: process.env.NODE_ENV !== "development",
//     maxAge: 24 * 60 * 60 * 1000,
//     httpOnly: false,
//   }),
// );
app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not available");
});
app.use(errorHandler);

export { app };

