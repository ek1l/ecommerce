import { Product } from '../../components/product';
import { useGetProducts } from '../../hooks/useGetProducts';
import './index.css';

export const ShopPage = () => {
  const { products } = useGetProducts();
  console.log(products);
  return (
    <div className="shop">
      <div className="products">
        {products.map((product) => (
          <div>
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
