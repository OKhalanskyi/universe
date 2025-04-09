'use client';

import React from 'react';
import { CalendarIcon, GitFork, RefreshCw, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Repository } from '../interfaces/repository';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { UpdateRepositoryDialog } from './update-repository-dialog';
import { DeleteRepositoryDialog } from './delete-repository-dialog';
import { useRefreshRepository } from '../model/use-refresh-repository';

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const { refreshRepository, isLoading } = useRefreshRepository(repository.id);

  const handleRefresh = () => {
    refreshRepository();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repository.owner}/{repository.name}
                </a>
              </h3>
              {repository.isUserOwned && (
                <Badge variant="outline" className="ml-2">
                  Мій репозиторій
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Створено{' '}
              {formatDistanceToNow(new Date(repository.createdAt), {
                addSuffix: true,
                locale: uk,
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <UpdateRepositoryDialog repository={repository} />
            <DeleteRepositoryDialog
              repositoryId={repository.id}
              repositoryName={`${repository.owner}/${repository.name}`}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex space-x-6 pt-2">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-500" />
            <span>{repository.stars}</span>
          </div>

          <div className="flex items-center">
            <GitFork className="mr-1 h-4 w-4" />
            <span>{repository.forks}</span>
          </div>

          <div className="flex items-center">
            <Badge variant="outline">{repository.openIssues} issues</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
