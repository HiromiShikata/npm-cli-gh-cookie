import { GithubRepository } from '../../domain/usecases/adapter-interfaces/GithubRepository';
export declare class PuppeteerGithubRepository implements GithubRepository {
  getCookieContent: (
    userName: string,
    password: string,
    authenticatorKey: string,
  ) => Promise<string>;
}
//# sourceMappingURL=PuppeteerGithubRepository.d.ts.map
