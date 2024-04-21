import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      axios.create({
        baseURL: "http://ticketingg.dev",
      });
      const response = await axios[method](url, body, {});
      // const res2 = await axios.get("/api/users/currentuser");
      // console.log(res2.data);
      if (onSuccess) {
        await onSuccess();
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooops....</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;

