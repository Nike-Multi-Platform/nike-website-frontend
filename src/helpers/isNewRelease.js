export const isNewRelease = (createdAt) => {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(
    currentDate.setDate(currentDate.getDate() - 30)
  );
  return new Date(createdAt) > thirtyDaysAgo;
};
