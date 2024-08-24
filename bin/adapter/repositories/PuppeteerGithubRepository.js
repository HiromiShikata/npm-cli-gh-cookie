"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerGithubRepository = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const authenticator_1 = require("authenticator");
class PuppeteerGithubRepository {
    constructor() {
        this.getCookieContent = async (userName, password, authenticatorKey) => {
            const browser = await puppeteer_1.default.launch({
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
            const token = (0, authenticator_1.generateToken)(authenticatorKey);
            await page.keyboard.type(token);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const cookie = await page.cookies();
            await browser.close();
            return JSON.stringify(cookie);
        };
    }
}
exports.PuppeteerGithubRepository = PuppeteerGithubRepository;
//# sourceMappingURL=PuppeteerGithubRepository.js.map