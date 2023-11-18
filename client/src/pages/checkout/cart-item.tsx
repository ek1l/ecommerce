import { useContext } from 'react';
import { IProduct } from '../../models/interfaces';
import { IShopContext, ShopContext } from '../../context/shop-context';
import './index.css';

interface Props {
  product: IProduct;
}

export const CartItem = (props: Props) => {
  const { _id, imageURL, productName, price } = props.product;
  const { addToCart, removeFromCart, updateCartItemCount, getItemCount } =
    useContext<IShopContext>(ShopContext);
  const cartItemCount = getItemCount(_id);
  return (
    <div className="cart">
      <div className="cartItem">
        <img src={imageURL} alt={productName} />
        <div className="description">
          <h3>{productName}</h3>
          <p>Price: ${price}</p>
        </div>
        <div className="countHandler">
          <button onClick={() => removeFromCart(_id)}> - </button>
          <input
            type="number"
            value={cartItemCount}
            onChange={(e) => updateCartItemCount(Number(e.target.value), _id)}
          />
          <button onClick={() => addToCart(_id)}> + </button>
        </div>
      </div>
    </div>
  );
};
