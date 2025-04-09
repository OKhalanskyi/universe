'use client';

import React from 'react';
import { Github } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

interface GithubLoginButtonProps {
  className?: string;
  disabled?: boolean;
}

export function GithubLoginButton({ className, disabled }: GithubLoginButtonProps) {

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      asChild
      disabled={disabled}
    >
      <Link href="http://localhost:3001/api/auth/github">
        <Github className="mr-2 h-4 w-4" />
        Увійти через GitHub
      </Link>
    </Button>
  );
}
