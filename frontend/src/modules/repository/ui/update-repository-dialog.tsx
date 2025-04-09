'use client';

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Edit2 } from "lucide-react";
import { useUpdateRepository } from "../model/use-update-repository";
import { Repository } from "../interfaces/repository";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Loader2 } from "lucide-react";
import { useProjects } from "@/modules/project/model/use-projects";

interface UpdateRepositoryDialogProps {
  repository: Repository;
  trigger?: React.ReactNode;
}

export function UpdateRepositoryDialog({
                                         repository,
                                         trigger,
                                       }: UpdateRepositoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(repository.projectId || 'none');
  const { updateRepository, isLoading } = useUpdateRepository(repository.id);
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  const handleSubmit = () => {
    updateRepository({ projectId: projectId === 'none' ? undefined : projectId });
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
          <DialogTitle>Змінити проєкт для репозиторію</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Проєкт</label>
            {isProjectsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Завантаження проєктів...</span>
              </div>
            ) : (
              <Select
                value={projectId}
                onValueChange={setProjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть проєкт" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Зберігання...
              </>
            ) : (
              "Зберегти зміни"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}