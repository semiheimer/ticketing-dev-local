import axios from "axios";
// Next.js, server-side'de çalışırken, tarayıcıdan otomatik olarak
// çerezlere erişimi olmaz.Bu nedenle, çerezleri manuel olarak Axios
// isteğine eklemeniz gerekebilir
const getUrl = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      baseURL: "http://auth-srv:3000",
      headers: {
        cookie: req.headers.cookie,
      },
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
export default getUrl;
