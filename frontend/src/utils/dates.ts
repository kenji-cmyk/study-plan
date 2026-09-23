export const monthName = (year: number, month: number) =>
  new Date(year, month - 1).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
export const localDate = (date: string) => new Date(`${date}T12:00:00`);
