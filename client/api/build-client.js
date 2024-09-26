import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: "http://auth-srv:3000",
      headers: {
        cookie: req.headers.cookie,
      },
    });
  } else {
    console.log(" window defined");
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
