export class DateUtils {
  public static AsString(date : Date) : string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}/${month}`
  }

  public static getDdMmYyyy(string : string) : Date | undefined {
    var strings = string.split("-");
    if(strings.length != 3)
      return undefined;

    return new Date(`${strings[1]}/${strings[0]}/${strings[2]}`)
  }
}
