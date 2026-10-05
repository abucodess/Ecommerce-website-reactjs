import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";

import AppRoutes from "./app/router";
import { fetchproducts } from "./features/products/productSlice";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    dispatch(fetchproducts());
    dispatch(fetchWishlist(user.id));
  }, [user?.id, dispatch]);

  return (
    <>
      <AppRoutes />

      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        stacked
        transition={Slide}
        theme="dark"
      />
    </>
  );
}

export default App;