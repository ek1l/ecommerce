/* eslint-disable array-callback-return */
import { useContext } from 'react';
import { useGetProducts } from '../../hooks/useGetProducts';
import { IProduct } from '../../models/interfaces';
import { IShopContext, ShopContext } from '../../context/shop-context';
import { CartItem } from './cart-item';
import './index.css';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage = () => {
  const { getCartItemCount, getTotalCartAmount, checkout } =
    useContext<IShopContext>(ShopContext);
  const totalAmount = getTotalCartAmount();

  const { products } = useGetProducts();

  const navigate = useNavigate();
  console.log(totalAmount);
  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cart">
        {products &&
          products.map((product: IProduct, index) => {
            if (getCartItemCount(product._id) !== 0) {
              return <CartItem key={index} product={product} />;
            }
          })}
      </div>

      {totalAmount > 0 ? (
        <div className="checkout">
          <p> Subtotal: ${totalAmount} </p>
          <button onClick={() => navigate('/')}> Continue Shopping </button>
          <button
            onClick={() => {
              const customerID = localStorage.getItem('userID');
              checkout(customerID);
            }}
          >
            Checkout
          </button>
        </div>
      ) : (
        <h1> Your Shopping Cart is Empty</h1>
      )}
    </div>
  );
};
