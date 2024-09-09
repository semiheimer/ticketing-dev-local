import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";
import getUrl from "../utils/get-Url";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AppComponent = ({
  Component,
  pageProps,
  currentUser = {},
  redirectTo,
}) => {
  const router = useRouter();
  console.log(redirectTo);

  useEffect(() => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  }, [redirectTo, router]);
  if (redirectTo) return null;
  return (
    <div className="container">
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
  let redirectTo = null;

  if (!data?.currentUser) {
    if (
      appContext.ctx.pathname.includes("orders") ||
      appContext.ctx.pathname.includes("tickets")
    )
      redirectTo = "/auth/signin";
  }

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
    redirectTo,
  };
};

export default AppComponent;
