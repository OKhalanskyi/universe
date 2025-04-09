'use client';

import React from "react";
import { CalendarIcon, Clock, GitFork, Github, Star } from "lucide-react";
import { formatDistance } from "date-fns";
import { uk } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Project } from "../interfaces/project";
import { Badge } from "@/shared/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { EditProjectDialog } from "./edit-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const repoCount = project.repositories?.length || 0;
  const totalStars = project.repositories?.reduce((sum, repo) => sum + repo.stars, 0) || 0;
  const totalForks = project.repositories?.reduce((sum, repo) => sum + repo.forks, 0) || 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{project.name}</CardTitle>
          <div className="flex space-x-2">
            <EditProjectDialog project={project} />
            <DeleteProjectDialog
              projectId={project.id}
              projectName={project.name}
            />
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {formatDistance(new Date(project.updatedAt), new Date(), {
            addSuffix: true,
            locale: uk,
          })}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-24">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description || "Без опису"}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Github className="mr-1 h-4 w-4" />
            <span className="text-sm">{repoCount}</span>
          </div>

          {repoCount > 0 && (
            <>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span className="text-sm">{totalStars}</span>
              </div>

              <div className="flex items-center">
                <GitFork className="mr-1 h-4 w-4" />
                <span className="text-sm">{totalForks}</span>
              </div>
            </>
          )}
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href={`/projects/${project.id}`}>
            Відкрити
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}