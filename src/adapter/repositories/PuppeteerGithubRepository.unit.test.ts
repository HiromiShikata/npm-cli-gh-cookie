import { PuppeteerGithubRepository } from './PuppeteerGithubRepository';

const mockKeyboardType = jest.fn().mockResolvedValue(undefined);
const mockWaitForSelector = jest.fn().mockResolvedValue(undefined);
const mockFocus = jest.fn().mockResolvedValue(undefined);
const mockClick = jest.fn().mockResolvedValue(undefined);
const mockWaitForNavigation = jest.fn().mockResolvedValue(undefined);
const mockCookies = jest
  .fn()
  .mockResolvedValue([{ name: 'logged_in', value: 'yes' }]);
const mockGoto = jest.fn().mockResolvedValue(undefined);
const mockScreenshot = jest.fn().mockResolvedValue(undefined);
const mockContent = jest.fn().mockResolvedValue('');
const mockNewPage = jest.fn().mockResolvedValue({
  goto: mockGoto,
  focus: mockFocus,
  click: mockClick,
  waitForNavigation: mockWaitForNavigation,
  waitForSelector: mockWaitForSelector,
  cookies: mockCookies,
  screenshot: mockScreenshot,
  content: mockContent,
  keyboard: {
    type: mockKeyboardType,
  },
});
const mockClose = jest.fn().mockResolvedValue(undefined);
const mockLaunch = jest.fn().mockResolvedValue({
  newPage: mockNewPage,
  close: mockClose,
});
const mockGenerateToken = jest.fn().mockReturnValue('123456');

jest.mock('puppeteer', () => {
  return {
    __esModule: true,
    default: {
      launch: (...args: unknown[]): unknown => {
        return mockLaunch(...args);
      },
    },
  };
});
jest.mock('authenticator', () => {
  return {
    generateToken: (...args: unknown[]): unknown => {
      return mockGenerateToken(...args);
    },
  };
});

describe('PuppeteerGithubRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockKeyboardType.mockResolvedValue(undefined);
    mockWaitForSelector.mockResolvedValue(undefined);
    mockFocus.mockResolvedValue(undefined);
    mockClick.mockResolvedValue(undefined);
    mockWaitForNavigation.mockResolvedValue(undefined);
    mockCookies.mockResolvedValue([{ name: 'logged_in', value: 'yes' }]);
    mockGoto.mockResolvedValue(undefined);
    mockScreenshot.mockResolvedValue(undefined);
    mockContent.mockResolvedValue('');
    mockNewPage.mockResolvedValue({
      goto: mockGoto,
      focus: mockFocus,
      click: mockClick,
      waitForNavigation: mockWaitForNavigation,
      waitForSelector: mockWaitForSelector,
      cookies: mockCookies,
      screenshot: mockScreenshot,
      content: mockContent,
      keyboard: {
        type: mockKeyboardType,
      },
    });
    mockClose.mockResolvedValue(undefined);
    mockLaunch.mockResolvedValue({
      newPage: mockNewPage,
      close: mockClose,
    });
    mockGenerateToken.mockReturnValue('123456');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('inputTotp', () => {
    it('should call waitForSelector before focus on #app_totp', async () => {
      const callOrder: string[] = [];
      mockWaitForSelector.mockImplementation((selector: string) => {
        callOrder.push(`waitForSelector:${selector}`);
        return Promise.resolve();
      });
      mockFocus.mockImplementation((selector: string) => {
        callOrder.push(`focus:${selector}`);
        return Promise.resolve();
      });

      const repository = new PuppeteerGithubRepository();
      const loginPromise = repository.getCookieContent(
        'user',
        'pass',
        'authKey',
      );
      await jest.advanceTimersByTimeAsync(10000);
      await loginPromise;

      expect(mockWaitForSelector).toHaveBeenCalledWith('#app_totp', {
        timeout: 10000,
      });
      expect(mockFocus).toHaveBeenCalledWith('#app_totp');
      const waitForSelectorIndex = callOrder.indexOf(
        'waitForSelector:#app_totp',
      );
      const focusIndex = callOrder.indexOf('focus:#app_totp');
      expect(waitForSelectorIndex).not.toBe(-1);
      expect(focusIndex).not.toBe(-1);
      expect(waitForSelectorIndex).toBeLessThan(focusIndex);
    });
  });

  describe('getCookieContent', () => {
    it('should call waitForSelector for #app_totp during login', async () => {
      const repository = new PuppeteerGithubRepository();
      const promise = repository.getCookieContent('user', 'pass', 'authKey');
      await jest.advanceTimersByTimeAsync(10000);
      const result = await promise;

      expect(mockWaitForSelector).toHaveBeenCalledWith('#app_totp', {
        timeout: 10000,
      });
      expect(typeof result).toBe('string');
    });
  });
});
