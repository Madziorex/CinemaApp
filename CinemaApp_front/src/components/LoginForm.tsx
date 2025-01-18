import React, { useState } from 'react';
import api from '../services/api';

interface UserLogin {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formState, setFormState] = useState<UserLogin>({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/User/Login', formState);
      if (response.status === 200) {
        alert('Zalogowano pomyślnie!');
      }
      else {
        alert('Nieprawidłowy email lub hasło.');
      }
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      setErrorMessage('Nieprawidłowy email lub hasło.');
    }
  };

  return (
    <div>
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit" onClick={handleSubmit}>Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginForm;