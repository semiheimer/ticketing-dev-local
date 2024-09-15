import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Link from "next/link";

const Signin = () => {
  const [email, setEmail] = useState("john@gmail.com");
  const [password, setPassword] = useState("aA-#123456");
  const { doRequest, errors } = useRequest.post({
    url: "/api/users/signin",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit} className='container'>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign In</button>
      <div className='mt-3'>
        <p>
          If you don't have an account,{" "}
          <Link href='/auth/signup'>sign up here</Link>.
        </p>
      </div>
    </form>
  );
};

export default Signin;
