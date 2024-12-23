import { PuppeteerGithubRepository } from './PuppeteerGithubRepository';
import { config } from 'dotenv';

describe('PuppeteerGithubRepository', () => {
  jest.setTimeout(60000);
  let repository: PuppeteerGithubRepository;
  config();

  beforeAll(() => {
    repository = new PuppeteerGithubRepository();
  });

  it('should return a string after completing the process', async () => {
    const userName = process.env.USERNAME || '';
    const password = process.env.PASSWORD || '';
    const authenticatorKey = process.env.AUTHENTICATOR_KEY || '';

    const result = await repository.getCookieContent(
      userName,
      password,
      authenticatorKey,
    );

    expect(typeof result).toBe('string');
    const cookie: unknown = JSON.parse(result);
    if (!Array.isArray(cookie)) {
      throw new Error('Invalid cookie array');
    }
    const loggedIn = cookie
      .filter(
        (c: unknown): c is { name: string; value: string } =>
          c !== null && typeof c === 'object' && 'name' in c && 'value' in c,
      )
      .some((c) => c.name === 'logged_in' && c.value === 'yes');
    expect(loggedIn).toBeDefined();
  });
});
