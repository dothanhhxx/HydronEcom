/** Bỏ dấu tiếng Việt để tìm "dinh sen" vẫn ra "Đinh Sen". */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase();
