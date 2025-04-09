'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { RepositoryForm, RepositoryFormValues } from './repository-form';
import { useCreateRepository } from '../model/use-create-repository';

interface CreateRepositoryDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  projectId?: string;
}

export function CreateRepositoryDialog({
  trigger,
  projectId,
}: CreateRepositoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { createRepository, isLoading } = useCreateRepository();

  const defaultValues: RepositoryFormValues = {
    path: '',
    projectId,
  };

  const handleSubmit = (values: RepositoryFormValues) => {
    createRepository(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Додати репозиторій
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Додати GitHub репозиторій</DialogTitle>
        </DialogHeader>
        <RepositoryForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Додати репозиторій"
        />
      </DialogContent>
    </Dialog>
  );
}
