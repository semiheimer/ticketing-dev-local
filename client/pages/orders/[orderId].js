import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest.post({
    url: "/api/payments",
    body: {
      orderId: order.id,
      token: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51LXhToAETTjhE7o2Eki4xi8qO3pbJvOK76erG2PmBKPT5XrENZ2i3FavA0wGP2GMgkF3RQmFKcZ3D0jP8QVa6B0j00V3sAikod'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
