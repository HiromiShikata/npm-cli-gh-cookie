#!/usr/bin/env node
import { Command } from 'commander';
import { GetCookieContentUseCase } from '../../../domain/usecases/GetCookieContentUseCase';
import { PuppeteerGithubRepository } from '../../repositories/PuppeteerGithubRepository';

const program = new Command();
program
  .argument('<username>', 'Username')
  .argument('<password>', 'Password')
  .argument('<authenticatorKey>', 'Authenticator Key')
  .name('Get gh cookie')
  .action(
    async (username: string, password: string, authenticatorKey: string) => {
      const puppeteerGithubRepository = new PuppeteerGithubRepository();
      const useCase = new GetCookieContentUseCase(puppeteerGithubRepository);
      const cookie = await useCase.run(username, password, authenticatorKey);
      console.log(cookie);
    },
  );
if (process.argv) {
  program.parse(process.argv);
}
