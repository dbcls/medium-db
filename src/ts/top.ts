import { EVENT_READY } from "./app/Consts";
import { setUpFreeSearch } from "./app/components/FreeSearch";
import { setUpTaxonFilter } from "./app/components/TaxonFilter";
import { setUpStats } from "./app/components/setUpStats";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setUpFreeSearch();
    setUpTaxonFilter();
    setUpStats();
  });
})();
