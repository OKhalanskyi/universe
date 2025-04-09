"use client";

import React, {useState} from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import apiClient from "@/config/axios-client";
import Link from "next/link";

interface GithubLoginButtonProps {
  className?: string;
  disabled?: boolean;
}

export function GithubLoginButton({
                                    className,
                                    disabled,
                                  }: GithubLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      asChild
      disabled={disabled || isLoading}
    >
      <Link href="http://localhost:3001/api/auth/github">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            З'єднання...
          </>
        ) : (
          <>
            <Github className="mr-2 h-4 w-4" />
            Увійти через GitHub
          </>
        )}
      </Link>
    </Button>
  );
}