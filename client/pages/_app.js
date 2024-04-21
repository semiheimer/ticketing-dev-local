import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";
import getUrl from "../utils/get-Url";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className='container'>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = getUrl(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;

