import { EVENT_READY } from "./app/Consts";
import { SmoothScroll } from "imagelogic-tools/src/motion/SmoothScroll";
import { EasingType } from "imagelogic-tools/src/motion/Easing";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setUpAdvancedSearch();
  });
  //
  const setUpAdvancedSearch = () => {
    document.addEventListener("STANZA_RUN_ACTION", (e: CustomEvent) => {
      const table = document.querySelector<HTMLElement>(
        "togostanza-gmdb-media-alignment-table"
      );
      table.setAttribute("gm_ids", (e.detail as string[]).join(","));
      table.style.display = "block";
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
