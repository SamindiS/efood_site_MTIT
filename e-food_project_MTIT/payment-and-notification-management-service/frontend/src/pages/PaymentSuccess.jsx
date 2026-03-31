import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // You can verify the payment with your backend here
      console.log('Payment successful with session ID:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Successful</h2>
      <p>Thank you for your payment!</p>
    </div>
  );
};

export default PaymentSuccess;