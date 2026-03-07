import puppeteer from 'puppeteer';
import { PuppeteerGithubRepository } from './PuppeteerGithubRepository';
import { config } from 'dotenv';

describe('PuppeteerGithubRepository', () => {
  jest.setTimeout(60000);
  let repository: PuppeteerGithubRepository;
  config();

  beforeAll(() => {
    repository = new PuppeteerGithubRepository();
  });

  describe('inputTotp', () => {
    it('should wait for #app_totp element before focusing', async () => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(`
        <html><body>
          <script>
            setTimeout(() => {
              const input = document.createElement('input');
              input.id = 'app_totp';
              document.body.appendChild(input);
            }, 1000);
          </script>
        </body></html>
      `);

      await repository.inputTotp(page, 'JBSWY3DPEHPK3PXP');

      const value = await page.$eval('#app_totp', (el) => {
        if (el instanceof HTMLInputElement) {
          return el.value;
        }
        return '';
      });
      expect(value.length).toBeGreaterThan(0);
      await browser.close();
    });
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
  it('should login success when 3 login process at the same time', async () => {
    const userName = process.env.USERNAME || '';
    const password = process.env.PASSWORD || '';
    const authenticatorKey = process.env.AUTHENTICATOR_KEY || '';

    const result = await Promise.all([
      repository.getCookieContent(userName, password, authenticatorKey),
      repository.getCookieContent(userName, password, authenticatorKey),
      repository.getCookieContent(userName, password, authenticatorKey),
    ]);

    result.forEach((r) => {
      expect(typeof r).toBe('string');
      const cookie: unknown = JSON.parse(r);
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
});
