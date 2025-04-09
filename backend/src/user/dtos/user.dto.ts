import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name?: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  githubId?: string;

  @Exclude()
  password?: string;

  @Exclude()
  githubAccessToken?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
