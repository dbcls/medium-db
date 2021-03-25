import { EVENT_READY } from "./app/Consts";
import { qs } from "imagelogic-tools/src/dom/qs";
import { SmoothScroll } from "imagelogic-tools/src/motion/SmoothScroll";
import { EasingType } from "imagelogic-tools/src/motion/Easing";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });

  const setup = () => {
    const table = qs("#table");

    document.addEventListener("STANZA_ROUND_TREE_CLICK", (e: CustomEvent) => {
      const ids: string[] = e.detail.taxIds;
      table.setAttribute("t_id", ids.join(","));
      setTimeout(() => {
        SmoothScroll.animate({
          target: table,
          duration: 500,
          easing: EasingType.easeInOutQuad,
          offset: 100,
        });
      }, 500);
    });
  };
})();
