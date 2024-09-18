import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";
import getUrl from "../utils/get-Url";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppComponent = ({ Component, pageProps, currentUser = {} }) => {
  return (
    <div className="container">
      <ToastContainer />
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = getUrl(appContext.ctx);

  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
