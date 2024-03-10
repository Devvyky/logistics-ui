export const formatDate = (dateStr: string) => {
  const formattedDate = new Date(dateStr).toLocaleDateString('fr');
  return formattedDate;
};
