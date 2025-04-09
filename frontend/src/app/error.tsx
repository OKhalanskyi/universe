'use client';

import { AlertOctagon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-6 w-6 text-destructive" />
            <CardTitle>Error</CardTitle>
          </div>
          <CardDescription>This section of the application encountered a problem</CardDescription>
        </CardHeader>

        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Section Error</AlertTitle>
            <AlertDescription>
              {error?.message || 'An unexpected error occurred in this section'}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
