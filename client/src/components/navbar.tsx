import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ShopContext } from '../context/shop-context';
import { useGetProducts } from '../hooks/useGetProducts';

export const Navbar = () => {
  const { getItemCount } = useContext(ShopContext);

  const { products } = useGetProducts();
  let count = 0;
  products.map((product) => {
    return (count += getItemCount(product._id));
  });

  return (
    <div className="navbar">
      <div className="navbar-title">
        <Link to="/">
          <h1>Ek1l Shop</h1>
        </Link>
      </div>
      <div className="navbarLinks ">
        <Link to="/"> Shop </Link>
        <Link to="/purchased-items"> Purchases </Link>
        <Link to="/checkout">
          <FontAwesomeIcon icon={faShoppingCart} />
          {count > 0 && <>{count}</>}
        </Link>
      </div>
    </div>
  );
};
