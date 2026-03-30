import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password });
            loginUser(data);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
      <div style={{ padding: 16, maxWidth: 520, margin: '0 auto' }}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={{ padding: 10 }}>Sign In</button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{ padding: 10, background: '#f2f2f2' }}
          >
            Create an account
          </button>
        </form>
      </div>
    );
};