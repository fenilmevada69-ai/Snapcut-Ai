import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/src/components/Logo';
import { useAuthStore } from '@/src/store/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coins, LogOut, Settings, User } from 'lucide-react';

export function Navbar() {
  const { user, profile, signOut } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link to="/api-docs" className="hover:text-primary transition-colors">API</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-white/5">
                <Coins className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">{profile?.credits || 0} Credits</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" id="user-menu-trigger">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-white/5">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 glow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
