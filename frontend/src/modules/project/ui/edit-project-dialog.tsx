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
import { Edit2 } from 'lucide-react';
import { ProjectForm, ProjectFormValues } from './project-form';
import { useUpdateProject } from '../model/use-update-project';
import { Project } from '../interfaces/project';

interface EditProjectDialogProps {
  project: Project;
  trigger?: React.ReactNode;
}

export function EditProjectDialog({ project, trigger }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateProject, isLoading } = useUpdateProject(project.id);

  const defaultValues: ProjectFormValues = {
    name: project.name,
    description: project.description || '',
  };

  const handleSubmit = (values: ProjectFormValues) => {
    updateProject(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редагувати проєкт</DialogTitle>
        </DialogHeader>
        <ProjectForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Зберегти зміни"
        />
      </DialogContent>
    </Dialog>
  );
}
