export const formatDate = (dateStr: string) => {
  const formattedDate = new Date(dateStr).toLocaleDateString("en-GB");
  return formattedDate;
};
