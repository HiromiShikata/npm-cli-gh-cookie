import puppeteer from 'puppeteer';
import { generateToken } from 'authenticator';
import { GithubRepository } from '../../domain/usecases/adapter-interfaces/GithubRepository';

export class PuppeteerGithubRepository implements GithubRepository {
  getCookieContent = async (
    userName: string,
    password: string,
    authenticatorKey: string,
  ): Promise<string> => {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
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

    await page.focus('#app_totp');
    const token = generateToken(authenticatorKey);
    await page.keyboard.type(token);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const cookie = await page.cookies();

    await browser.close();
    return JSON.stringify(cookie);
  };
}
