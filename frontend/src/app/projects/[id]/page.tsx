'use client';

import React from "react";
import { useParams } from "next/navigation";
import {PrivateLayout} from "@/modules/auth";
import {useProject} from "@/modules/project/model/use-project";
import {Button} from "@/shared/ui/button";
import Link from "next/link";
import {ArrowLeft, Loader2} from "lucide-react";
import {EditProjectDialog} from "@/modules/project/ui/edit-project-dialog";
import {DeleteProjectDialog} from "@/modules/project/ui/delete-project-dialog";
import {PageHeader} from "@/widgets/page-header";
import {RepositoryList} from "@/modules/repository/ui/repository-list";


export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { data: project, isLoading, error } = useProject(projectId, true);

  return (
    <PrivateLayout>
      {isLoading ? (
        <Loader2 />
      ) : error || !project ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-xl font-bold mb-4">Помилка завантаження проєкту</h1>
          <Button asChild>
            <Link href="/frontend/public">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до проєктів
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8 mx-auto py-8">
          <div className="flex items-center mb-8">
            <Button asChild variant="ghost" size="sm" className="mr-4">
              <Link href="/frontend/public">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Link>
            </Button>
          </div>

          <PageHeader
            heading={project.name}
            subheading={project.description || "Без опису"}
            actions={
              <div className="flex space-x-2">
                <EditProjectDialog project={project} />
                <DeleteProjectDialog
                  projectId={project.id}
                  projectName={project.name}
                />
              </div>
            }
          />

          <div className="border-t pt-8">
            <RepositoryList projectId={projectId} />
          </div>
        </div>
      )}
    </PrivateLayout>
  );
}