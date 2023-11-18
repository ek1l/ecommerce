import { Product } from '../../components/product';
import { useGetProducts } from '../../hooks/useGetProducts';
import './index.css';

export const ShopPage = () => {
  const { products } = useGetProducts();
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
