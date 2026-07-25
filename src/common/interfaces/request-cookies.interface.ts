import { COOKIE_KEYS } from '../constants/cookie.constants';

export interface RequestCookies {
  [COOKIE_KEYS.REFRESH_TOKEN]?: string;
}
