import getUrl from "../utils/get-Url";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = getUrl(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;

