interface MonthPair {
  month: string;
  numerical: number
}

export class StatisticsConstants {
  static Months : MonthPair[] = [
    {month: "January", numerical: 1},
    {month: "February", numerical: 2},
    {month: "March", numerical: 3},
    {month: "April", numerical: 4},
    {month: "May", numerical: 5},
    {month: "June", numerical: 6},
    {month: "July", numerical: 7},
    {month: "August", numerical: 8},
    {month: "September", numerical: 9},
    {month: "October", numerical: 10},
    {month: "November", numerical: 11},
    {month: "December", numerical: 12},
  ];

  static MonthNames : string[] = StatisticsConstants.Months.map(pair => pair.month);
}


