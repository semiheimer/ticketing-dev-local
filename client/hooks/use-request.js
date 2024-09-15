import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (additionalData = {}) => {
    try {
      setErrors(null);
      const finalBody = { ...body, ...additionalData };
      const response = await axios[method](url, finalBody, {});

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.error(err);
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

useRequest.post = (props) => {
  return useRequest({ ...props, method: "post" });
};

// Attaching get method
useRequest.get = (props) => {
  return useRequest({ ...props, method: "get" });
};

export default useRequest;
