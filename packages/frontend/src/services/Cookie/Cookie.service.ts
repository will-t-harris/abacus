import Cookies from "js-cookie";
import { CookieKeys } from "../../shared/constants";

export default class CookieService {
  public static getCookie(key: CookieKeys): string | undefined {
    return Cookies.get(key);
  }

  public static setCookie(key: CookieKeys, value: string): void {
    Cookies.set(key, value, {
      sameSite: "strict",
      //TODO set to true if we ever need to use https
      secure: false,
    });
  }

  public static removeCookie(key: CookieKeys): void {
    Cookies.remove(key);
  }
}
