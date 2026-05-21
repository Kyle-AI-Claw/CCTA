import { Home, Coins, User, TrendingUp, Tag as TagIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';

export function Nav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/coins', icon: Coins, label: 'Collection' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/stats', icon: TrendingUp, label: 'Stats' },
    { path: '/tags', icon: TagIcon, label: 'Tags' },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-6 w-6" />
            <span className="font-bold text-lg">Coin Collection</span>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {user.username}
              </span>
              <Button variant="ghost" size="sm" onClick={() => useAuth().logout()}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
