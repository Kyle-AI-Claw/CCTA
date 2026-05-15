import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './store/authStore';
import { Nav } from './components/Nav';
import { Coins } from './pages/Coins';
import { CoinDetail } from './pages/CoinDetail';
import { EditCoin } from './pages/EditCoin';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Stats } from './pages/Stats';
import { TagManager } from './pages/TagManager';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Nav />
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <Coins />
                </div>
              </PrivateRoute>
            } />
            <Route path="/coins" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <Coins />
                </div>
              </PrivateRoute>
            } />
            <Route path="/coins/detail/:id" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <CoinDetail />
                </div>
              </PrivateRoute>
            } />
            <Route path="/coins/edit/:id" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <EditCoin />
                </div>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <Profile />
                </div>
              </PrivateRoute>
            } />
            <Route path="/stats" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <Stats />
                </div>
              </PrivateRoute>
            } />
            <Route path="/tags" element={
              <PrivateRoute>
                <div className="container mx-auto px-4 py-8">
                  <TagManager />
                </div>
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
