"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCookieContentUseCase = void 0;
class GetCookieContentUseCase {
    constructor(githubRepository) {
        this.githubRepository = githubRepository;
    }
    async run(userName, password, authenticatorKey) {
        return this.githubRepository.getCookieContent(userName, password, authenticatorKey);
    }
}
exports.GetCookieContentUseCase = GetCookieContentUseCase;
//# sourceMappingURL=GetCookieContentUseCase.js.map