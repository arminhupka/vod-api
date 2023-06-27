export const calculateTax = (total: number): number => {
  return Math.floor(total * (100 / (+process.env.TAX_RATE + 100)));
};
