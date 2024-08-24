import { GithubRepository } from './adapter-interfaces/GithubRepository';

export class GetCookieContentUseCase {
  constructor(private readonly githubRepository: GithubRepository) {}

  async run(
    userName: string,
    password: string,
    authenticatorKey: string,
  ): Promise<string> {
    return this.githubRepository.getCookieContent(
      userName,
      password,
      authenticatorKey,
    );
  }
}
