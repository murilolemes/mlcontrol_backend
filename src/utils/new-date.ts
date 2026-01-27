import { formatInTimeZone } from "date-fns-tz";

export function getNewDate(date?: Date) {
  if (!date) {
    date = new Date();
  }
  return formatInTimeZone(date, 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ssXXX")
}
