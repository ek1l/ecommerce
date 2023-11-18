/* eslint-disable array-callback-return */
import { useContext } from 'react';
import { useGetProducts } from '../../hooks/useGetProducts';
import { IProduct } from '../../models/interfaces';
import { IShopContext, ShopContext } from '../../context/shop-context';
import { CartItem } from './cart-item';
import './index.css';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage = () => {
  const { getItemCount, getTotalCartAmount, checkout } =
    useContext<IShopContext>(ShopContext);
  const { products } = useGetProducts();
  const navigate = useNavigate();
  const totalAmount = getTotalCartAmount().toFixed(2);
  return (
    <div className="cart">
      <div>
        <h1>Your cart items</h1>
      </div>
      <div className="cart">
        {products.map((product: IProduct, index) => {
          if (getItemCount(product._id) !== 0) {
            return <CartItem key={index} product={product} />;
          }
        })}
      </div>
      {Number(totalAmount) > 0 ? (
        <div className="checkout">
          <p>Subtotal: ${totalAmount}</p>
          <button onClick={() => navigate('/')}> Continue Shopping</button>
          <button onClick={() => checkout()}>Checkout</button>
        </div>
      ) : (
        <h1>Your Shopping Cart is Empty</h1>
      )}
    </div>
  );
};
