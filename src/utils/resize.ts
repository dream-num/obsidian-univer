export function setCtxPos(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const p = { x: rect.left, y: rect.top };

  let r = document.querySelector(":root") as HTMLElement;
  if (p.x) {
    r.style.setProperty("--ctx_menu_x", `${p.x}px`);
    r.style.setProperty("--ctx_menu_y", -1 * p.y + 50 + "px");
  }
}
