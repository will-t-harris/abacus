/** Wrapper around client-side storage mechanism (currently using localStorage) */
export default class ClientStorageService {
  public static set({ key, value }: { key: string; value: string }) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.log("Error saving to client storage: ", error);
    }
  }

  public static get({ key }: { key: string }) {
    return localStorage.getItem(key);
  }

  public static delete({ key }: { key: string }) {
    return localStorage.removeItem(key);
  }
}
