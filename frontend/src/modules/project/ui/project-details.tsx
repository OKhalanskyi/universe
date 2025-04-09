'use client';

import React from 'react';
import { useProject } from '../model/use-project';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { EditProjectDialog } from './edit-project-dialog';
import { DeleteProjectDialog } from './delete-project-dialog';

export function ProjectDetails() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading, error } = useProject(projectId, true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive">Помилка завантаження проєкту</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Створено: {format(new Date(project.createdAt), 'PPP', { locale: uk })}
          </p>
          {project.description && (
            <p className="mt-4 text-muted-foreground">{project.description}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <EditProjectDialog project={project} />
          <DeleteProjectDialog projectId={project.id} projectName={project.name} />
        </div>
      </div>

      <div className="pt-4">{/*<RepositoryList projectId={projectId} />*/}</div>
    </div>
  );
}
