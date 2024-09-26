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
  const [paymentLoading, setPaymentLoading] = useState(false); // Ödeme işlemi sırasında loading state
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
    doRequest();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    setPaymentLoading(true); // Ödeme işlemi başladı

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: currentUser.email,
          },
        },
      }
    );

    if (error) {
      console.error("Payment error:", error.message);
      setPaymentLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      Router.push("/orders");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || !clientSecret || paymentLoading}
      >
        {paymentLoading ? "Processing..." : `Pay ${order.ticket.price} USD`}
      </button>
      {errors && <div>{errors}</div>}
    </form>
  );
};

const OrderShow = ({ order, currentUser, errorMessage }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  if (!order) {
    return (
      <div>
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (timeLeft <= 0) {
    return <div>Order Expired</div>;
  }

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

  return (
    <div>
      <h4>Time left to pay: {timeLeft} seconds</h4>
      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} currentUser={currentUser} />
      </Elements>
    </div>
  );
};

// Stripe public key ile stripePromise oluşturuluyor
const stripePromise = loadStripe(
  "pk_test_51LXhToAETTjhE7o2Eki4xi8qO3pbJvOK76erG2PmBKPT5XrENZ2i3FavA0wGP2GMgkF3RQmFKcZ3D0jP8QVa6B0j00V3sAikod"
);

// getInitialProps: Server-side'da order bilgisi alınıyor
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  try {
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
  } catch (err) {
    console.log("err", err);
    return { order: null, errorMessage: "Order could not be fetched." };
  }
};

export default OrderShow;
