import { Cookie, Page } from 'puppeteer';
import { GithubRepository } from '../../domain/usecases/adapter-interfaces/GithubRepository';
export declare class PuppeteerGithubRepository implements GithubRepository {
  getCookieContent: (
    userName: string,
    password: string,
    authenticatorKey: string,
  ) => Promise<string>;
  isSuccessfulLogin: (cookies: Cookie[]) => boolean;
  inputTotp: (page: Page, authenticatorKey: string) => Promise<void>;
}
//# sourceMappingURL=PuppeteerGithubRepository.d.ts.map
