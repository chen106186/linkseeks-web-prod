/**
 * 判断时候是闰年
 * @param year 年份
 * @returns 是或者否
 */
 export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取距离某个时间点相差的天数
 * @param date 目标日期
 * @param start 开始日期
 * @returns 天数
 */
export function getDays(date: Date, start?: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let days = day;

  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let i = 0; i < month - 1; i += 1) {
    days += monthDays[i];
  }
  // 如果是闰年,天数加一
  if (isLeapYear(year) && month > 2) {
    days += 1;
  }
  if (start) {
    return days - getDays(start);
  }
  return days;
}

/**
 * 通过减去时间来改变传入的 Date
 * @param date Date
 * @param amount 需要减去的数值
 * @param unit 'days' | 'month' | 'year'
 */
export function subtractDate(date: Date, amount: number, unit: 'days' | 'month' | 'year'): Date {
  const newDate = new Date(date);
  switch (unit) {
    case 'days': {
      newDate.setDate(date.getDate() - amount);
      break;
    }
    case 'month': {
      newDate.setMonth(date.getMonth() - amount);
      break;
    }
    case 'year': {
      newDate.setFullYear(date.getFullYear() - amount);
      break;
    }
    default:
      break;
  }
  return newDate;
}

/**
 * 计算相差目标天数的时间
 * @param difference number 相差的天数
 */
export function calculateTime(difference: number): Date {
  const curDate = new Date();
  const milliseconds = curDate.getTime() + 1000 * 60 * 60 * 24 * difference;
  curDate.setTime(milliseconds);
  return curDate;
}
