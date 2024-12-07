import { GithubRepository } from './adapter-interfaces/GithubRepository';
export declare class GetCookieContentUseCase {
  private readonly githubRepository;
  constructor(githubRepository: GithubRepository);
  run(
    userName: string,
    password: string,
    authenticatorKey: string,
  ): Promise<string>;
}
//# sourceMappingURL=GetCookieContentUseCase.d.ts.map
