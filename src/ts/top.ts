import { EVENT_READY } from "./app/Consts";
import { setUpFreeSearch } from "./app/components/FreeSearch";
import { setUpStats } from "./app/components/setUpStats";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setUpFreeSearch();
    // setUpTaxonFilter();
    setUpStats();
  });
})();
