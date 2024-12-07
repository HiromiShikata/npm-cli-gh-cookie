import dotenv from 'dotenv';
import { functionGetCookieContent } from './adapter/entry-points/functions';
dotenv.config();
export const hello = (name: string) => `hello ${name}`;
export const getCookieContent = functionGetCookieContent;
