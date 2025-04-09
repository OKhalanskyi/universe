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
import { ProjectForm, ProjectFormValues } from './project-form';
import { useCreateProject } from '../model/use-create-project';

interface CreateProjectDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

export function CreateProjectDialog({ trigger }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { createProject, isLoading } = useCreateProject();

  const handleSubmit = (values: ProjectFormValues) => {
    createProject(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Новий проєкт
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Створити новий проєкт</DialogTitle>
        </DialogHeader>
        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} submitText="Створити проєкт" />
      </DialogContent>
    </Dialog>
  );
}
