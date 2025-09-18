export default function dateParser(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;


  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`; //dd/mm/aaaa
}