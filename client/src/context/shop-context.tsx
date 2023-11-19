/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
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
  getCartItemCount: (itemId: string) => number;
  getTotalCartAmount: () => number;
  checkout: (customerID: string) => void;
  availableMoney: number;
  purchasedItems: IProduct[];
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItemCount: () => 0,
  getTotalCartAmount: () => 0,
  checkout: () => null,
  availableMoney: 0,
  purchasedItems: [],
  isAuthenticated: false,
  setIsAuthenticated: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = ({ children }) => {
  const [cookies, setCookies] = useCookies(['acess_token']);
  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    cookies.acess_token !== null,
  );
  const navigate = useNavigate();
  const { products } = useGetProducts();

  const fetchAvailableMoney = async () => {
    const link = `http://localhost:4000/user/available-money/${localStorage.getItem(
      'userID',
    )} `;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axios.get(link, {
        headers: { Authorization: cookies.acess_token },
      });
      setAvailableMoney(res.data.availableMoney);
    } catch (error) {
      alert('ERROR: Something went wrong.');
    }
  };

  const fetchPurchasedItems = async () => {
    const link = `http://localhost:4000/product/purchased-items/${localStorage.getItem(
      'userID',
    )} `;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axios.get(link, {
        headers: { Authorization: cookies.acess_token },
      });
      setPurchasedItems(res.data.purchasedItems);
    } catch (error) {
      alert('ERROR: Something went wrong.');
    }
  };

  const getCartItemCount = (itemId: string): number => {
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

  const getTotalCartAmount = () => {
    if (products.length === 0) return;
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item,
        );

        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  };

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
      setCartItems({});
      fetchAvailableMoney();
      fetchPurchasedItems();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableMoney();
      fetchPurchasedItems();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.clear();
      setCookies('acess_token', null);
    }
  }, [isAuthenticated, setCookies]);

  let contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItemCount,
    getTotalCartAmount,
    checkout,
    availableMoney,
    purchasedItems,
    isAuthenticated,
    setIsAuthenticated,
  };
  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};
