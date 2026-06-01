import { useEffect, useState } from "react";

export const CUSTOMER_AUTH_EVENT = "customer-auth-change";

export const notifyCustomerAuthChange = () => {
  window.dispatchEvent(new Event(CUSTOMER_AUTH_EVENT));
};

const readAuth = () => ({
  token: localStorage.getItem("customer_token"),
  customerName: localStorage.getItem("customer_name") || "",
});

export function useCustomerAuth() {
  const [auth, setAuth] = useState(readAuth);

  useEffect(() => {
    const sync = () => setAuth(readAuth());

    window.addEventListener(CUSTOMER_AUTH_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(CUSTOMER_AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    token: auth.token,
    customerName: auth.customerName,
    isLoggedIn: Boolean(auth.token),
  };
}
