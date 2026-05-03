declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

export async function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpayCheckout(options: {
  amount: number;
  orderId: string;
  name: string;
  email: string;
  onSuccess: (response: any) => void;
}) {
  const rzpOptions = {
    key: RAZORPAY_KEY,
    amount: options.amount,
    currency: 'INR',
    name: 'SnapCut AI',
    description: options.name,
    order_id: options.orderId,
    prefill: {
      email: options.email,
    },
    theme: {
      color: '#0EA5FF',
    },
    handler: options.onSuccess,
  };

  const rzp = new window.Razorpay(rzpOptions);
  rzp.open();
}
