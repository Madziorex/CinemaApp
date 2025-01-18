import { decodeToken, getToken } from '../services/authService';

export default function Dashboard() {
  const token = getToken();

  if (!token) {
    return <p>Brak tokenu, proszę się zalogować.</p>;
  }

  const decoded = decodeToken(token);
  const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'Brak emaila';
  const role = decoded.role;

  return (
    <div>
      <h1>Panel użytkownika</h1>
      <p>Email: {email}</p>
      <p>Rola: {role}</p>
    </div>
  );
}
