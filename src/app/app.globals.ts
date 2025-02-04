export class AppGlobals{
  public static EMPLOYEES_MANAGER_BASE_URL = "http://localhost:8089";
  public static DIRTY_URLS: Set<number> = new Set();
  public static UNSAVED_EMPLOYEE: Map<string,string> = new Map<string,string>();
}
