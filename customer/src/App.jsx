import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";

import AppRoutes from "./app/router";
import { fetchproducts } from "./features/products/productSlice";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";

function App() {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchproducts());

    if (isAuthenticated && user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

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
