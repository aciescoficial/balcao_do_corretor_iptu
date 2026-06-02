import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface IPTUStandaloneLayoutProps {
  children: React.ReactNode;
}

const IPTUStandaloneLayout: React.FC<IPTUStandaloneLayoutProps> = ({ children }) => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.user_metadata?.name) {
      const parts = (user.user_metadata.name as string).trim().split(/\s+/);
      return parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return (user.email?.[0] ?? "U").toUpperCase();
  };

  const getUserDisplayName = () => {
    return (user?.user_metadata?.name as string | undefined) || user?.email || "";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isAdminUser = ["admin", "diretoria"].includes(userRole ?? "");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-aciesc-primary shadow-md shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Logo badge */}
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/20 shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-[10px] font-medium leading-none tracking-widest uppercase">
                ACIESC
              </p>
              <p className="text-white font-bold text-sm leading-tight truncate">
                Consulta IPTU — Itapema
              </p>
            </div>
          </div>

          {/* Right: user menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-white px-2 py-1.5 h-auto rounded-lg shrink-0"
                >
                  <Avatar className="h-7 w-7 border border-white/30">
                    <AvatarImage src={user.user_metadata?.avatar_url as string | undefined} />
                    <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden sm:block max-w-[180px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate font-medium">
                  {user.email}
                </div>
                <DropdownMenuSeparator />

                {/* Show "Painel ACIESC" only for admin/diretoria */}
                {isAdminUser && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/dashboard")}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Painel ACIESC
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="large" text="Carregando consulta..." />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 border-t bg-white py-2.5 text-center text-[11px] text-muted-foreground">
        ACIESC · Associação Comercial e Industrial do Município de Itapema &nbsp;·&nbsp; Dados obtidos em tempo real da Prefeitura Municipal de Itapema
      </footer>
    </div>
  );
};

export default IPTUStandaloneLayout;
