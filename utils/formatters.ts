export const formatPrice = (price: number | null): string => {
  if (price === null || price === 0) return "Contact us";
  const pounds = price / 100;
  if (pounds % 1 === 0) {
    return `£${pounds}`;
  }
  return `£${pounds.toFixed(2)}`;
};