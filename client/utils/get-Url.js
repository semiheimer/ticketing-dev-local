import axios from "axios";
// Next.js, server-side'de çalışırken, tarayıcıdan otomatik olarak
// çerezlere erişimi olmaz.Bu nedenle, çerezleri manuel olarak Axios
// isteğine eklemeniz gerekebilir
const getUrl = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: {
        Host: "ticketing.dev",
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
