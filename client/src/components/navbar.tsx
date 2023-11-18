import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ShopContext } from '../context/shop-context';
import { useGetProducts } from '../hooks/useGetProducts';
 

export const Navbar = () => {
  const { getCartItemCount, setIsAuthenticated } = useContext(ShopContext);
  const { availableMoney, isAuthenticated } = useContext(ShopContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
 
  const { products } = useGetProducts();
  let count = 0;
  products.map((product) => {
    return (count += getCartItemCount(product._id));
  });

  const logout = () => {
    setIsAuthenticated(false);
  };
  return (
    <div className="navbar">
      <div className="navbar-title">
        <Link to="/">
          <h1>Ek1l Shop</h1>
        </Link>
      </div>
      <div className="navbarLinks ">
        {isAuthenticated && (
          <>
            <Link to="/"> Shop </Link>
            <Link to="/purchased-items"> Purchases </Link>
            <Link to="/checkout">
              <FontAwesomeIcon icon={faShoppingCart} />
              {count > 0 && <>{count}</>}
            </Link>
            <Link to="auth" onClick={logout}>
              Logout
            </Link>
            <span>${availableMoney.toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  );
};
