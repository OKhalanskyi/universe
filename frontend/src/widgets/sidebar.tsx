'use client';

import React from 'react';
import {useLogout} from "@/modules/auth/model/use-logout";
import {usePathname} from "next/navigation";
import {useCurrentUser} from "@/modules/auth/model/use-get-current-user";
import {LogOut} from "lucide-react";
import {Button} from "@/shared/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/shared/ui/avatar";

const Sidebar = () => {
  const { data: user } = useCurrentUser();
  const { logout, isLoading: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2">
        <h2 className="text-xl font-bold tracking-tight">GitHub CRM</h2>
      </div>
      <div className="mt-auto px-3 py-4 border-t">
        {user && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name || user.email}/>
                <AvatarFallback>{(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user.name || user.email}</p>
                {user.name && (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4"/>
          Вийти
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;