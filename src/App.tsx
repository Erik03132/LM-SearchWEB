import { useStore } from './useStore';
import { LoginForm } from './LoginForm';
import { Dashboard } from './Dashboard';

export function App() {
  const { isAuthenticated } = useStore();

  console.log("[v0] App rendered, isAuthenticated:", isAuthenticated);

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}
