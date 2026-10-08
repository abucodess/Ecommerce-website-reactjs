
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

export default function CartList() {
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.products);

  const items = cartItems
    .map((cartItem) => {
      const product = products.find(
        (product) =>
          String(product.id) === String(cartItem.productId)
      );

      if (!product) {
        return null;
      }

      return {
        ...product,
        productId: cartItem.productId,
        size: cartItem.size,
        quantity: cartItem.quantity,
      };
    })
    .filter(Boolean);

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <CartItem
          key={`${item.productId}-${item.size}`}
          item={item}
        />
      ))}
    </div>
  );
}

