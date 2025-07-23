"use client";

import * as React from 'react';
import {
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookUser, CalendarPlus, LayoutDashboard, LogIn, LogOut, Settings } from 'lucide-react';
import { TorelliAncharLogo } from './icons';
import { useAuth } from './auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logout bem-sucedido!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer logout',
        description: 'Não foi possível fazer o logout. Tente novamente.',
      });
    }
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <TorelliAncharLogo className="size-8 text-sidebar-foreground" />
          <div className="flex flex-col">
            <h2 className="font-headline text-xl font-semibold text-sidebar-foreground">
              Torelli e Anchar
            </h2>
            <p className="text-xs text-sidebar-foreground/70">Agendamentos</p>
          </div>
          {isMobile && <SidebarTrigger className="ml-auto" />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {user ? (
            <>
              {isAdmin ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/admin/dashboard'}
                      tooltip="Dashboard"
                    >
                      <Link href="/admin/dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/admin/settings'}
                      tooltip="Configurações"
                    >
                      <Link href="/admin/settings">
                        <Settings />
                        <span>Configurações</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/'}
                      tooltip="Agendar Horário"
                    >
                      <Link href="/">
                        <CalendarPlus />
                        <span>Agendar Horário</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/meus-agendamentos'}
                      tooltip="Meus Agendamentos"
                    >
                      <Link href="/meus-agendamentos">
                        <BookUser />
                        <span>Meus Agendamentos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/login'}
                tooltip="Login"
              >
                <Link href="/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      {user && (
        <SidebarFooter className="p-4">
          <Separator className="mb-4 bg-sidebar-border" />
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuário'} data-ai-hint="user avatar"/>
              <AvatarFallback>
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.displayName || 'Cliente'}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {user.email}
              </p>
            </div>
            <SidebarMenuButton
              size="sm"
              variant="ghost"
              className="size-8 p-0"
              tooltip="Sair"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      )}
    </>
  );
}
