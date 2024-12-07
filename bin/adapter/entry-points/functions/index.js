"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionGetCookieContent = void 0;
const GetCookieContentUseCase_1 = require("../../../domain/usecases/GetCookieContentUseCase");
const PuppeteerGithubRepository_1 = require("../../repositories/PuppeteerGithubRepository");
const functionGetCookieContent = (username, password, authenticatorKey) => {
    const puppeteerGithubRepository = new PuppeteerGithubRepository_1.PuppeteerGithubRepository();
    const useCase = new GetCookieContentUseCase_1.GetCookieContentUseCase(puppeteerGithubRepository);
    return useCase.run(username, password, authenticatorKey);
};
exports.functionGetCookieContent = functionGetCookieContent;
//# sourceMappingURL=index.js.map