
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

export default function CartList() {
  const items = useSelector((state) => state.cart.items);

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <CartItem
          key={`${item.id}-${item.size}`}
          item={item}
        />
      ))}
    </div>
  );
}
