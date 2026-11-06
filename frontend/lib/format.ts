// Định dạng dùng chung cho server và client.
export function formatVND(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
}
