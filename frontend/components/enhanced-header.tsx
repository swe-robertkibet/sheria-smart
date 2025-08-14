"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Home,
  FileText,
  MessageCircle,
  Scale,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface EnhancedHeaderProps {
  currentView?: "dashboard" | "documents" | "chat" | "analysis" | "structured-chat" | "document-form";
  onNavigate?: (view: "dashboard" | "documents" | "chat" | "analysis") => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  className?: string;
}

export function EnhancedHeader({
  currentView = "dashboard",
  onNavigate,
  onSearch,
  showSearch = false,
  className = "",
}: EnhancedHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      description: "Return to main dashboard",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      description: "Create and manage legal documents",
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircle,
      description: "Quick legal questions",
    },
    {
      id: "analysis",
      label: "Analysis",
      icon: Scale,
      description: "Structured legal analysis",
    },
  ] as const;

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size={mobile ? "lg" : "sm"}
            className={`${
              mobile ? "w-full justify-start" : ""
            } ${
              isActive
                ? "bg-[#7C9885] text-white hover:bg-[#7C9885]/90"
                : "text-[#718096] hover:text-[#2D3748] hover:bg-[#F8FAF9]"
            }`}
            onClick={() => {
              onNavigate?.(item.id);
              if (mobile) setIsMobileMenuOpen(false);
            }}
          >
            <Icon className={`w-4 h-4 ${mobile ? "mr-3" : "mr-2"}`} />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <header className={`bg-white border-b border-[#F5F5F5] sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/sheria-smart-ico.png"
              alt="Sheria Smart Icon"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <div className="text-xl font-bold">
              <span className="text-[#7C9885]">Sheria</span>
              <span className="text-[#C99383]"> Smart</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavItems />
          </nav>

          {/* Search Bar (Desktop) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#718096] w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search documents, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 bg-[#F8FAF9] border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {showSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#718096]"
                onClick={() => {/* Toggle search on mobile */}}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="w-8 h-8 bg-[#7C9885]">
                    {user?.picture ? (
                      <AvatarImage src={user.picture} alt={user?.name || user?.email} />
                    ) : null}
                    <AvatarFallback className="text-white font-semibold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[#2D3748] hidden lg:inline">
                    {user?.name || user?.email || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#718096]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-3">
                    <Image
                      src="/sheria-smart-ico.png"
                      alt="Sheria Smart Icon"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                    <div className="text-lg font-bold">
                      <span className="text-[#7C9885]">Sheria</span>
                      <span className="text-[#C99383]"> Smart</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                  {/* Mobile Search */}
                  {showSearch && (
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#718096] w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Search documents..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4"
                        />
                      </div>
                    </form>
                  )}

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    <NavItems mobile />
                  </nav>

                  {/* Mobile User Section */}
                  <div className="pt-6 mt-6 border-t border-[#E2E8F0] space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#F8FAF9]">
                      <Avatar className="w-10 h-10 bg-[#7C9885]">
                        {user?.picture ? (
                          <AvatarImage src={user.picture} alt={user?.name || user?.email} />
                        ) : null}
                        <AvatarFallback className="text-white font-semibold">
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2D3748] truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-[#718096] truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start text-[#718096]"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start text-[#718096]"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Preferences
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}