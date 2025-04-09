export interface Repository {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string | Date;
  isUserOwned: boolean;
  projectId?: string;
}

export interface CreateRepositoryInput {
  path: string;
  projectId?: string;
}

export interface UpdateRepositoryInput {
  projectId?: string;
}
