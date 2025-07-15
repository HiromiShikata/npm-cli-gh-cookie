"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerGithubRepository = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const authenticator_1 = require("authenticator");
const fs_1 = __importDefault(require("fs"));
class PuppeteerGithubRepository {
    constructor() {
        this.getCookieContent = async (userName, password, authenticatorKey) => {
            const browser = await puppeteer_1.default.launch({
                headless: true,
                defaultViewport: null,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.goto('https://github.com/login', { waitUntil: 'networkidle0' });
            await page.focus('#login_field');
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
            if (!fs_1.default.existsSync('tmp/gh-cookies')) {
                fs_1.default.mkdirSync('tmp/gh-cookies', { recursive: true });
            }
            for (let i = 0; i < 3; i++) {
                await page.screenshot({
                    path: `tmp/gh-cookies/failed-to-login-${i}.png`,
                });
                await page.screenshot({ path: 'tmp/gh-cookies/failed-to-login.png' });
                const html = await page.content();
                console.error(html);
                await new Promise((resolve) => setTimeout(resolve, 5000));
                if (html.includes('The two-factor code you entered has already been used or is too old to be used.')) {
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
        this.isSuccessfulLogin = (cookies) => {
            return cookies.some((c) => c !== null && typeof c === 'object' && 'name' in c && 'value' in c);
        };
        this.inputTotp = async (page, authenticatorKey) => {
            await page.focus('#app_totp');
            const token = (0, authenticator_1.generateToken)(authenticatorKey);
            await page.keyboard.type(token);
            await new Promise((resolve) => setTimeout(resolve, 5000));
        };
    }
}
exports.PuppeteerGithubRepository = PuppeteerGithubRepository;
//# sourceMappingURL=PuppeteerGithubRepository.js.map