import { useContext } from 'react';
import { Product } from '../../components/product';
import { useGetProducts } from '../../hooks/useGetProducts';
import './index.css';
import { IShopContext, ShopContext } from '../../context/shop-context';
import { Navigate } from 'react-router-dom';

export const ShopPage = () => {
  const { products } = useGetProducts();
  const { isAuthenticated } = useContext<IShopContext>(ShopContext);
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  return (
    <div className="shop">
      <div className="products">
        {products.map((product, index) => (
          <div key={index}>
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
