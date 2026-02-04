import { useStore } from './useStore';
import { LoginForm } from './LoginForm';
import { Dashboard } from './Dashboard';

export function App() {
  const { isAuthenticated } = useStore();

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}
