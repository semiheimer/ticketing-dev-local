import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutForm = ({ order, currentUser }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });

  useEffect(() => {
    // Call the doRequest function to get the clientSecret when the component mounts
    doRequest();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Confirm the payment with the clientSecret
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: currentUser.email,
          },
        },
      },
    );

    if (error) {
      console.error(error);
    } else if (paymentIntent.status === "succeeded") {
      // Payment succeeded, navigate to orders page
      Router.push("/orders");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type='submit' disabled={!stripe || !clientSecret}>
        Pay {order.ticket.price} USD
      </button>
      {errors}
    </form>
  );
};

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

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

  if (timeLeft <= 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h4>Time left to pay: {timeLeft} seconds</h4>
      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} currentUser={currentUser} />
      </Elements>
    </div>
  );
};
const stripePromise = loadStripe(
  "pk_test_51LXhToAETTjhE7o2Eki4xi8qO3pbJvOK76erG2PmBKPT5XrENZ2i3FavA0wGP2GMgkF3RQmFKcZ3D0jP8QVa6B0j00V3sAikod",
);
// Fetch the order data during server-side rendering
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
