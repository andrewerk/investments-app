// Generates random quantity for current searched stock. If it hasn`t been searched already
// saves quantity for new Stock;

function generateRandomQuantity(max: number) {
  return Math.floor(Math.random() * (max - 1)) + 1;
}
export default { generateRandomQuantity };
