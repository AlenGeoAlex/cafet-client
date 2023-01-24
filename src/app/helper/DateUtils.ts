export class DateUtils {
  public static AsString(date : Date) : string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}/${month}`
  }
}
