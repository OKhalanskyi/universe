import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GithubRepositoryData } from '../interfaces/githubRepositoryData';

@Injectable()
export class GithubApiService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly userAgent = 'GitHub-CRM-App';

  constructor(private readonly httpService: HttpService) {}

  async getRepositoryData(
    owner: string,
    repo: string,
    userToken?: string,
  ): Promise<GithubRepositoryData> {
    try {
      const headers: Record<string, string> = {
        'User-Agent': this.userAgent,
        Accept: 'application/vnd.github.v3+json',
      };

      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      const { data } = await firstValueFrom(
        this.httpService.get<GithubRepositoryData>(
          `${this.baseUrl}/repos/${owner}/${repo}`,
          { headers },
        ),
      );

      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
      }
      if (error.response?.status === 403) {
        throw new HttpException(
          'API rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Failed to fetch repository data from GitHub',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserRepositories(
    accessToken: string,
  ): Promise<GithubRepositoryData[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<GithubRepositoryData[]>(
          `${this.baseUrl}/user/repos?sort=updated&per_page=100`,
          {
            headers: {
              'User-Agent': this.userAgent,
              Authorization: `token ${accessToken}`,
            },
          },
        ),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch repositories from GitHub',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
