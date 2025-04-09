'use client';

import React, { useState } from "react";
import { useRepositories } from "../model/use-repositories";
import { RepositoryCard } from "./repository-card";
import { CreateRepositoryDialog } from "./create-repository-dialog";
import { Loader2, RefreshCw, ListFilter } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useSyncRepositories } from "../model/use-sync-repositories";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import {useCurrentUser} from "@/modules/auth/model/use-get-current-user";

interface RepositoryListProps {
  projectId?: string;
  showUnassigned?: boolean;
}

export function RepositoryList({ projectId, showUnassigned: initialShowUnassigned }: RepositoryListProps) {
  const [filterMode, setFilterMode] = useState<string>(initialShowUnassigned ? "unassigned" : "all");
  const { data: user } = useCurrentUser()

  const currentShowUnassigned = filterMode === "unassigned";

  const {
    data: repositories,
    isLoading,
    error,
    refetch
  } = useRepositories(projectId, currentShowUnassigned);

  const {
    syncRepositories,
    isLoading: isSyncing
  } = useSyncRepositories();

  const handleSyncRepositories = () => {
    syncRepositories();
  };

  const handleFilterChange = (value: string) => {
    if (value) {
      setFilterMode(value);
    }
  };

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
        <p className="text-destructive">Помилка завантаження репозиторіїв</p>
        <div className="flex space-x-4">
          <Button onClick={() => refetch()}>Спробувати знову</Button>
          <CreateRepositoryDialog projectId={projectId} />
        </div>
      </div>
    );
  }

  const showFilter = !projectId;

  const listTitle = projectId
    ? 'Репозиторії проєкту'
    : currentShowUnassigned
      ? 'Репозиторії без проєкту'
      : 'Всі репозиторії';

  const emptyMessage = projectId
    ? 'У цього проєкту ще немає репозиторіїв'
    : currentShowUnassigned
      ? 'У вас немає репозиторіїв без проєкту'
      : 'У вас ще немає доданих репозиторіїв';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{listTitle}</h2>
        <div className="flex items-center space-x-2">
          {showFilter && (
            <div className="mr-2 flex items-center w-80">
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
              <ToggleGroup type="single" value={filterMode} onValueChange={handleFilterChange}>
                <ToggleGroupItem value="all" aria-label="Показати всі репозиторії">
                  Всі
                </ToggleGroupItem>
                <ToggleGroupItem value="unassigned" aria-label="Показати репозиторії без проєкту" className="w-fit w-52">
                  Без проєкту
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
          {user?.githubId && (
            <Button
              variant="outline"
              onClick={handleSyncRepositories}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Синхронізувати з GitHub
            </Button>
          )}
          <CreateRepositoryDialog projectId={projectId} />
        </div>
      </div>

      {!repositories?.length ? (
        <div className="flex flex-col items-center justify-center h-40 border rounded-md bg-muted/20">
          <p className="text-muted-foreground mb-4">{emptyMessage}</p>
          <div className="flex space-x-4">
            {user?.githubId && (
              <Button
                variant="outline"
                onClick={handleSyncRepositories}
                disabled={isSyncing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Синхронізувати з GitHub
              </Button>
            )}
            <CreateRepositoryDialog projectId={projectId} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {repositories.map((repository) => (
            <RepositoryCard key={repository.id} repository={repository} />
          ))}
        </div>
      )}
    </div>
  );
}