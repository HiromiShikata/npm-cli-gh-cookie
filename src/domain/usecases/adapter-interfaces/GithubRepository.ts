export interface GithubRepository {
  getCookieContent(
    userName: string,
    password: string,
    authenticatorKey: string,
  ): Promise<string>;
}
