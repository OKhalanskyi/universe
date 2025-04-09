'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">404</CardTitle>
          <CardDescription className="text-xl">Page Not Found</CardDescription>
        </CardHeader>

        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>We couldn&#39;t find this page</AlertTitle>
            <AlertDescription>
              The page you are looking for doesn&#39;t exist or has been moved.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          <Link href="/frontend/public" passHref>
            <Button>Return Home</Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
