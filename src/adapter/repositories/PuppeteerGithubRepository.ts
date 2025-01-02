import puppeteer, { Cookie, Page } from 'puppeteer';
import { generateToken } from 'authenticator';
import { GithubRepository } from '../../domain/usecases/adapter-interfaces/GithubRepository';
import fs from 'fs';

export class PuppeteerGithubRepository implements GithubRepository {
  getCookieContent = async (
    userName: string,
    password: string,
    authenticatorKey: string,
  ): Promise<string> => {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://github.com/login', { waitUntil: 'networkidle0' });

    await page.focus('#login');
    await page.keyboard.type(userName, { delay: 100 });

    await page.focus('#password');
    await page.keyboard.type(password, { delay: 200 });

    await page.click('input[type="submit"]');
    await page.waitForNavigation();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await this.inputTotp(page, authenticatorKey);

    const cookie = await page.cookies();
    if (this.isSuccessfulLogin(cookie)) {
      await browser.close();
      return JSON.stringify(cookie);
    }

    if (!fs.existsSync('tmp/gh-cookies')) {
      fs.mkdirSync('tmp/gh-cookies', { recursive: true });
    }
    for (let i = 0; i < 3; i++) {
      await page.screenshot({
        path: `tmp/gh-cookies/failed-to-login-${i}.png`,
      });
      await page.screenshot({ path: 'tmp/gh-cookies/failed-to-login.png' });
      const html = await page.content();
      console.error(html);
      await new Promise((resolve) => setTimeout(resolve, 5000));

      if (
        html.includes(
          'The two-factor code you entered has already been used or is too old to be used.',
        )
      ) {
        await this.inputTotp(page, authenticatorKey);
      }
      const cookie = await page.cookies();
      if (this.isSuccessfulLogin(cookie)) {
        await browser.close();
        return JSON.stringify(cookie);
      }
    }
    throw new Error('Failed to login');
  };
  isSuccessfulLogin = (cookies: Cookie[]): boolean => {
    return cookies.some(
      (c: unknown): c is { name: string; value: string } =>
        c !== null && typeof c === 'object' && 'name' in c && 'value' in c,
    );
  };
  inputTotp = async (page: Page, authenticatorKey: string) => {
    await page.focus('#app_totp');
    const token = generateToken(authenticatorKey);
    await page.keyboard.type(token);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  };
}
