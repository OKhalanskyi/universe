export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  repositories?: any[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}