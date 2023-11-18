/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { createContext } from 'react';
import { useGetProducts } from '../hooks/useGetProducts';
import { IProduct } from '../models/interfaces';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export interface IShopContext {
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  getItemCount: (itemId: string) => number;
  getTotalCartAmount: () => number;
  checkout: () => void;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getItemCount: () => 0,
  getTotalCartAmount: () => 0,
  checkout: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});
  const navigate = useNavigate();
  const { products } = useGetProducts();

  const getItemCount = (itemId: string): number => {
    if (itemId in cartItems) {
      return cartItems[itemId];
    }
    return 0;
  };

  const addToCart = (itemId: string) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId: string) => {
    if (!cartItems[itemId]) return;
    if (cartItems[itemId] === 0) return;
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const updateCartItemCount = (newAmount: number, itemId: string) => {
    if (newAmount < 0) return;
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };

  const getTotalCartAmount = (): number => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item,
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  };
  const [cookies, _] = useCookies(['acess_token']);
  const checkout = async () => {
    const body = { customerID: localStorage.getItem('userID'), cartItems };
    const link = 'http://localhost:4000/product/checkout';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    try {
      await axios.post(link, body, {
        headers: {
          Authorization: cookies.acess_token,
        },
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  let contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getItemCount,
    getTotalCartAmount,
    checkout,
  };
  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};
