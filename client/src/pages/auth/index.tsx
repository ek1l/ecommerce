import './style.css';
import { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { UserErrors } from '../../errors';
import { useNavigate } from 'react-router-dom';

const linkRegister = 'http://localhost:4000/user/register';
const linkLogin = 'http://localhost:4000/user/login';

export const AuthPage = () => {
  return (
    <div className="auth">
      <Register /> <Login />
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      await axios.post(linkRegister, {
        username,
        password,
      });
      alert('Registration completed! Now Login.');
    } catch (error) {
      if (error.response.data.type === UserErrors.USERNAME_ALREADY_EXISTS) {
        return alert('Username already in use.');
      } else {
        return alert('ERROR: Something went wrong');
      }
    }
  };
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookies] = useCookies(['acess_token']);
  const navigate = useNavigate();
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await axios.post(linkLogin, {
        username,
        password,
      });
      setCookies('acess_token', result.data.token);
      localStorage.setItem('userID', result.data.userID);
      navigate('/');
    } catch (error) {
      let errorMessage: string = '';
      switch (error.response.data.type) {
        case UserErrors.NO_USER_FOUND:
          errorMessage = 'User does not exist';
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = 'Wrong username/password combination';
          break;
        default:
          errorMessage = 'Something went wrong';
      }
      alert('ERROR: ' + errorMessage);
    }
  };
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
