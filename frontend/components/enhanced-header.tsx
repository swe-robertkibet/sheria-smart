"use client";

import { useState } from "react";
import { Button, Input, Avatar, theme } from "antd";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
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
  const { token } = theme.useToken();
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


  return (
    <header 
      className={`sticky top-0 z-50 ${className}`}
      style={{
        backgroundColor: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorder}`
      }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/sheria-smart-ico.png"
              alt="Sheria Smart Icon"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <div className="text-xl font-bold">
              <span style={{ color: '#7C9885' }}>Sheria</span>
              <span style={{ color: '#C99383' }}> Smart</span>
            </div>
          </div>


          {/* Search Bar (Desktop) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: token.colorTextSecondary }}
                  />
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
                className="md:hidden"
                style={{ color: token.colorTextSecondary }}
                onClick={() => {/* Toggle search on mobile */}}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 px-3"
                  style={{ 
                    border: 'none',
                    background: 'transparent',
                    color: token.colorText
                  }}
                >
                  <Avatar 
                    size={32}
                    src={user?.picture}
                    style={{ 
                      backgroundColor: '#7C9885',
                      color: 'white'
                    }}
                  >
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </Avatar>
                  <span 
                    className="hidden lg:inline"
                    style={{ color: token.colorText }}
                  >
                    {user?.name || user?.email || "User"}
                  </span>
                  <ChevronDown 
                    className="w-4 h-4"
                    style={{ color: token.colorTextSecondary }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 max-w-[calc(100vw-16px)]">
                <DropdownMenuItem onClick={handleLogout} className="min-h-[44px] cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Trigger - Hidden on dashboard */}
          {currentView !== "dashboard" && (
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
                      <span style={{ color: '#7C9885' }}>Sheria</span>
                      <span style={{ color: '#C99383' }}> Smart</span>
                    </div>
                  </SheetTitle>
                  <VisuallyHidden.Root>
                    <SheetDescription>
                      Navigation menu with user profile and settings
                    </SheetDescription>
                  </VisuallyHidden.Root>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                  {/* Mobile Search */}
                  {showSearch && (
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: token.colorTextSecondary }}
                  />
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


                  {/* Mobile User Section */}
                  <div 
                    className="pt-6 mt-6 space-y-2"
                    style={{ 
                      borderTop: `1px solid ${token.colorBorder}`,
                      paddingTop: token.paddingLG,
                      marginTop: token.marginLG
                    }}
                  >
                    <div 
                      className="flex items-center space-x-3 p-3 rounded-lg"
                      style={{ 
                        backgroundColor: token.colorBgLayout,
                        borderRadius: token.borderRadius,
                        padding: token.paddingMD
                      }}
                    >
                      <Avatar 
                        size={40}
                        src={user?.picture}
                        style={{ 
                          backgroundColor: '#7C9885',
                          color: 'white'
                        }}
                      >
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-sm font-medium truncate"
                          style={{ 
                            color: token.colorText,
                            fontWeight: token.fontWeightStrong
                          }}
                        >
                          {user?.name || "User"}
                        </p>
                        <p 
                          className="text-xs truncate"
                          style={{ color: token.colorTextSecondary }}
                        >
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start"
                      style={{ color: token.colorTextSecondary }}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start"
                      style={{ color: token.colorTextSecondary }}
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
          )}

          {/* Mobile User Profile for Dashboard */}
          {currentView === "dashboard" && (
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="min-h-[44px] min-w-[44px] touch-manipulation"
                  >
                    <Avatar 
                      size={32}
                      src={user?.picture}
                      style={{ 
                        backgroundColor: '#7C9885',
                        color: 'white'
                      }}
                    >
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32 max-w-[calc(100vw-16px)] mr-4 sm:mr-2">
                  <DropdownMenuItem onClick={handleLogout} className="min-h-[44px] cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}