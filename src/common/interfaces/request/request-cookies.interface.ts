import { COOKIE_KEYS } from 'src/common/constants/cookie.constants';

export interface RequestCookies {
  [COOKIE_KEYS.REFRESH_TOKEN]?: string;
}
