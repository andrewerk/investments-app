function generateRandomQuantity(max: number) {
  return Math.floor(Math.random() * (max - 1)) + 1;
}
export default { generateRandomQuantity };
