
// Bugünün tarihini YYYY-MM-DD formatında veren motorumuz
export const getTodayFormatted = () => {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};