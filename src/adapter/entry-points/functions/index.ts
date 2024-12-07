import { GetCookieContentUseCase } from '../../../domain/usecases/GetCookieContentUseCase';
import { PuppeteerGithubRepository } from '../../repositories/PuppeteerGithubRepository';

export const functionGetCookieContent = (
  username: string,
  password: string,
  authenticatorKey: string,
): Promise<string> => {
  const puppeteerGithubRepository = new PuppeteerGithubRepository();
  const useCase = new GetCookieContentUseCase(puppeteerGithubRepository);
  return useCase.run(username, password, authenticatorKey);
};
