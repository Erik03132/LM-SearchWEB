import { useStore } from './store/useStore';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';

export function App() {
  const { isAuthenticated } = useStore();
  
  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}
