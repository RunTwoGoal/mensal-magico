import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, Home, Repeat, History, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../auth/AuthContext";

const AppHeader = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Aqui você faria o logout na sua API
    logout();
    console.log("Logout");
    navigate("/");
  };

  const navItems = [
    {
      title: "Contas",
      href: "/accounts",
      icon: Home,
    },
    {
      title: "Contas Recorrentes",
      href: "/recurring",
      icon: Repeat,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Card className="rounded-none border-b shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/accounts" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Mensal Mágico</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button 
                key={item.href}
                asChild
                variant={isActive(item.href) ? "default" : "ghost"}
                className="transition-smooth"
              >
                <Link to={item.href} className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            ))}
          </nav>

          {/* Desktop Logout */}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-2 transition-smooth"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-lg text-foreground">Mensal Mágico</span>
                </div>
                
                {navItems.map((item) => (
                  <Button 
                    key={item.href}
                    asChild
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="w-full justify-start transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                ))}
                
                <hr className="my-4" />
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start transition-smooth"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sair</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Card>
  );
};

export default AppHeader;