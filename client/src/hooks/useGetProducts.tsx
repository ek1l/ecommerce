import { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { useCookies } from 'react-cookie';
import { IProduct } from '../models/interfaces';
import { IShopContext, ShopContext } from '../context/shop-context';

export const useGetProducts = () => {
  const { isAuthenticated } = useContext<IShopContext>(ShopContext);
  const link = 'http://localhost:4000/product';
  const [products, setProducts] = useState<IProduct[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _] = useCookies(['acess_token']);
  const fetchProducts = async () => {
    try {
      const fetchProducts = await axios.get(link, {
        headers: { Authorization: cookies.acess_token },
      });
      setProducts(fetchProducts.data.products);
    } catch (error) {
      alert('ERRPR: Something went wrong');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return { products };
};
