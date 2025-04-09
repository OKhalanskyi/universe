'use client';

import React from 'react';
import { useProjects } from '../model/use-projects';
import { ProjectCard } from './project-card';
import { CreateProjectDialog } from './create-project-dialog';
import { Loader2 } from 'lucide-react';
import { useCurrentUser } from '@/modules/auth/model/use-get-current-user';

export function ProjectList() {
  const { data: projects, isLoading, error } = useProjects(true);
  const { data: user } = useCurrentUser();
  console.log(user);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Помилка завантаження проєктів</p>
        <CreateProjectDialog />
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">У вас ще немає проєктів</p>
        <CreateProjectDialog />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
