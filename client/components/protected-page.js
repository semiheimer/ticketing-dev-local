// pages/protected-page.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
const ProtectedPage = ({ Component, pageProps, currentUser = {} }) => {
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      const { pathname } = router;
      const redirectTo =
        pathname.startsWith("/orders") || pathname.startsWith("/tickets")
          ? "/"
          : "/auth/signin";

      router.push(redirectTo);
    }
  }, [currentUser, router]);
  if (!currentUser) {
    return null;
  }
  return <Component {...props} />;
};

export default ProtectedPage;
