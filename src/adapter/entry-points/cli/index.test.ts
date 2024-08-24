import { execSync } from 'child_process';

describe('commander program', () => {
  it('should output help contents', () => {
    const output = execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts -h',
    ).toString();

    expect(output.trim())
      .toEqual(`Usage: Get gh cookie [options] <username> <password> <authenticatorKey>

Arguments:
  username          Username
  password          Password
  authenticatorKey  Authenticator Key

Options:
  -h, --help        display help for command`);
  });
});
