#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const GetCookieContentUseCase_1 = require("../../../domain/usecases/GetCookieContentUseCase");
const PuppeteerGithubRepository_1 = require("../../repositories/PuppeteerGithubRepository");
const program = new commander_1.Command();
program
    .argument('<username>', 'Username')
    .argument('<password>', 'Password')
    .argument('<authenticatorKey>', 'Authenticator Key')
    .name('Get gh cookie')
    .action(async (username, password, authenticatorKey) => {
    const puppeteerGithubRepository = new PuppeteerGithubRepository_1.PuppeteerGithubRepository();
    const useCase = new GetCookieContentUseCase_1.GetCookieContentUseCase(puppeteerGithubRepository);
    const cookie = await useCase.run(username, password, authenticatorKey);
    console.log(cookie);
});
if (process.argv) {
    program.parse(process.argv);
}
//# sourceMappingURL=index.js.map