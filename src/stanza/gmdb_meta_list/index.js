/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/stanza/gmdb_meta_list/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/stanza/gmdb_meta_list/index.ts":
/*!********************************************!*\
  !*** ./src/stanza/gmdb_meta_list/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Stanza(async function (stanza, stanzaParams) {
    stanza.render({
        template: "stanza.html",
        parameters: {}
    });
    const offset = 0;
    const data = await fetchData(stanzaParams.api_url, offset, parseInt(stanzaParams.limit, 10));
    const htmlPrams = processData(data, offset, stanzaParams);
    render(stanza, htmlPrams, stanzaParams);
});
const render = (stanza, htmlParams, stanzaParams) => {
    var _a, _b;
    const limit = parseInt(stanzaParams.limit, 10);
    stanza.render({
        template: "stanza.html",
        parameters: htmlParams
    });
    (_a = stanza.select("#btnPrev")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", async () => {
        render(stanza, makeEmptyData(htmlParams), stanzaParams);
        const offset = htmlParams.offset - limit;
        const data = await fetchData(stanzaParams.api_url, offset, limit);
        const params = processData(data, offset, stanzaParams);
        render(stanza, params, stanzaParams);
    });
    (_b = stanza.select("#btnNext")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
        render(stanza, makeEmptyData(htmlParams), stanzaParams);
        const offset = htmlParams.offset + limit;
        const data = await fetchData(stanzaParams.api_url, offset, limit);
        const params = processData(data, offset, stanzaParams);
        render(stanza, params, stanzaParams);
    });
};
const processData = (response, offset, stanzaParams) => {
    const columnLabels = response.columns.map(item => item.label);
    const keys = response.columns.map(item => item.key);
    const noWraps = {};
    response.columns.forEach(item => noWraps[item.key] = item.nowrap);
    const data = response.contents.map(item => {
        const result = [];
        keys.forEach(key => {
            let value;
            if (typeof item[key] === "string") {
                value = { label: item[key] };
            }
            else {
                value = item[key];
            }
            if (noWraps[key]) {
                value.nowrap = true;
            }
            result.push(value);
        });
        return result;
    });
    const total = response.total;
    const _end = parseInt(stanzaParams.limit, 10) + offset;
    const end = _end <= total ? _end : total;
    const hasPrev = offset !== 0;
    const hasNext = end < total;
    const title = stanzaParams.title;
    const info = hasNext || hasPrev ? `showing ${offset + 1} to ${end} of total ${total} items` : `total ${total} items`;
    const _columns = stanzaParams.column_names;
    const showColumnNames = _columns.toLocaleLowerCase() === "false" ? false : Boolean(stanzaParams.column_names);
    return {
        title,
        offset,
        columnLabels,
        data,
        hasNext,
        hasPrev,
        info,
        showColumnNames
    };
};
const fetchData = async (url, offset, limit) => {
    return fetchLive(url, offset, limit);
};
const fetchLive = async (url, offset, limit) => {
    const [uri, query] = separateURL(url);
    const response = await fetch(uri, makeOptions({ offset, limit }, query));
    const result = await response.json();
    return result;
};
const fetchDummy = async (query, offset, limit) => {
    await timeout(1000);
    const total = 22;
    return {
        total: total,
        offset: offset,
        contents: makeContents(limit, offset, total),
        columns: [
            {
                key: "index",
                label: "INDEX",
            },
            {
                key: "gm_id",
                label: "GM ID",
                nowrap: true,
            },
            {
                key: "name",
                label: "NAME"
            },
        ]
    };
};
const makeContents = (count, offset, total) => {
    const result = [];
    const actualCount = count + offset < total ? count : total - offset + 1;
    for (let i = 0; i < actualCount; i++) {
        result.push({
            index: (i + offset).toString(),
            gm_id: {
                href: "/media/SY43q",
                label: "SY43a"
            },
            name: "BL AGAR (GLUCOSE BLOOD LIVER AGAR)"
        });
    }
    return result;
};
const makeEmptyData = (params) => {
    return { ...params, data: [] };
};
const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const separateURL = (url) => {
    const separated = /(.*)\?(.*)/.exec(url);
    let uri, query;
    if (separated) {
        uri = separated[1];
        query = separated[2];
    }
    else {
        uri = url;
        query = "";
    }
    return [uri, query];
};
const makeOptions = (params, query) => {
    let formBody = [];
    for (let key in params) {
        if (params[key] !== undefined) {
            formBody.push(key + "=" + encodeURIComponent(params[key]));
        }
    }
    const body = `${query}&${formBody.join("&")}`;
    return {
        method: "POST",
        mode: "cors",
        body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxDQUFlLEtBQUssV0FBVSxNQUFNLEVBQUUsWUFBWTtJQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ1osUUFBUSxFQUFFLGFBQWE7UUFDdkIsVUFBVSxFQUFFLEVBQUU7S0FDZixDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RixNQUFNLFNB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IFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50c1wiKTtcbiIsIlN0YW56YTxTdGFuemFQYXJhbXM+KGFzeW5jIGZ1bmN0aW9uKHN0YW56YSwgc3RhbnphUGFyYW1zKSB7XG4gIHN0YW56YS5yZW5kZXIoe1xuICAgIHRlbXBsYXRlOiBcInN0YW56YS5odG1sXCIsXG4gICAgcGFyYW1ldGVyczoge31cbiAgfSk7XG4gIGNvbnN0IG9mZnNldDogbnVtYmVyID0gMDtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShzdGFuemFQYXJhbXMuYXBpX3VybCwgb2Zmc2V0LCBwYXJzZUludChzdGFuemFQYXJhbXMubGltaXQsIDEwKSk7XG4gIGNvbnN0IGh0bWxQcmFtczogSFRNTFBhcmFtcyA9IHByb2Nlc3NEYXRhKGRhdGEsIG9mZnNldCwgc3RhbnphUGFyYW1zKTtcbiAgcmVuZGVyKHN0YW56YSwgaHRtbFByYW1zLCBzdGFuemFQYXJhbXMpO1xufSk7XG5cblxuY29uc3QgcmVuZGVyID0gKHN0YW56YTogU3RhbnphSW5zdGFuY2UsIGh0bWxQYXJhbXM6IEhUTUxQYXJhbXMsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zKSA9PiB7XG4gIGNvbnN0IGxpbWl0OiBudW1iZXIgPSBwYXJzZUludChzdGFuemFQYXJhbXMubGltaXQsIDEwKTtcbiAgc3RhbnphLnJlbmRlcih7XG4gICAgdGVtcGxhdGU6IFwic3RhbnphLmh0bWxcIixcbiAgICBwYXJhbWV0ZXJzOiBodG1sUGFyYW1zXG4gIH0pO1xuICBzdGFuemEuc2VsZWN0KFwiI2J0blByZXZcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYygpID0+IHtcbiAgICByZW5kZXIoc3RhbnphLCBtYWtlRW1wdHlEYXRhKGh0bWxQYXJhbXMpLCBzdGFuemFQYXJhbXMpO1xuICAgIGNvbnN0IG9mZnNldCA9IGh0bWxQYXJhbXMub2Zmc2V0IC0gbGltaXQ7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShzdGFuemFQYXJhbXMuYXBpX3VybCwgb2Zmc2V0LCBsaW1pdCk7XG4gICAgY29uc3QgcGFyYW1zOiBIVE1MUGFyYW1zID0gcHJvY2Vzc0RhdGEoZGF0YSwgb2Zmc2V0LCBzdGFuemFQYXJhbXMpO1xuICAgIHJlbmRlcihzdGFuemEsIHBhcmFtcywgc3RhbnphUGFyYW1zKTtcbiAgfSk7XG4gIHN0YW56YS5zZWxlY3QoXCIjYnRuTmV4dFwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jKCkgPT4ge1xuICAgIHJlbmRlcihzdGFuemEsIG1ha2VFbXB0eURhdGEoaHRtbFBhcmFtcyksIHN0YW56YVBhcmFtcyk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gaHRtbFBhcmFtcy5vZmZzZXQgKyBsaW1pdDtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKHN0YW56YVBhcmFtcy5hcGlfdXJsLCBvZmZzZXQsIGxpbWl0KTtcbiAgICBjb25zdCBwYXJhbXM6IEhUTUxQYXJhbXMgPSBwcm9jZXNzRGF0YShkYXRhLCBvZmZzZXQsIHN0YW56YVBhcmFtcyk7XG4gICAgcmVuZGVyKHN0YW56YSwgcGFyYW1zLCBzdGFuemFQYXJhbXMpO1xuICB9KTtcbn07XG5cbmNvbnN0IHByb2Nlc3NEYXRhID0gKHJlc3BvbnNlOiBBUElSZXNwb25zZSwgb2Zmc2V0OiBudW1iZXIsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zKTogSFRNTFBhcmFtcyA9PiB7XG4gIGNvbnN0IGNvbHVtbkxhYmVsczogc3RyaW5nW10gPSByZXNwb25zZS5jb2x1bW5zLm1hcChpdGVtID0+IGl0ZW0ubGFiZWwpO1xuICBjb25zdCBrZXlzOiBzdHJpbmdbXSA9IHJlc3BvbnNlLmNvbHVtbnMubWFwKGl0ZW0gPT4gaXRlbS5rZXkpO1xuICBjb25zdCBub1dyYXBzOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgcmVzcG9uc2UuY29sdW1ucy5mb3JFYWNoKGl0ZW0gPT4gbm9XcmFwc1tpdGVtLmtleV0gPSBpdGVtLm5vd3JhcCk7XG4gIGNvbnN0IGRhdGE6IEl0ZW1bXVtdID0gcmVzcG9uc2UuY29udGVudHMubWFwKGl0ZW0gPT4ge1xuICAgIGNvbnN0IHJlc3VsdDogSXRlbVtdID0gW107XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IFN0cmluZ0l0ZW07XG4gICAgICBpZiAodHlwZW9mIGl0ZW1ba2V5XSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YWx1ZSA9IHtsYWJlbDogaXRlbVtrZXldIGFzIHN0cmluZ307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGl0ZW1ba2V5XSBhcyBMaW5rSXRlbTtcbiAgICAgIH1cbiAgICAgIGlmIChub1dyYXBzW2tleV0pIHtcbiAgICAgICAgdmFsdWUubm93cmFwID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcbiAgY29uc3QgdG90YWw6IG51bWJlciA9IHJlc3BvbnNlLnRvdGFsO1xuICBjb25zdCBfZW5kOiBudW1iZXIgPSBwYXJzZUludChzdGFuemFQYXJhbXMubGltaXQsIDEwKSArIG9mZnNldDtcbiAgY29uc3QgZW5kOiBudW1iZXIgPSBfZW5kIDw9IHRvdGFsID8gX2VuZCA6IHRvdGFsO1xuICBjb25zdCBoYXNQcmV2OiBib29sZWFuID0gb2Zmc2V0ICE9PSAwO1xuICBjb25zdCBoYXNOZXh0OiBib29sZWFuID0gZW5kIDwgdG90YWw7XG4gIGNvbnN0IHRpdGxlOiBzdHJpbmcgPSBzdGFuemFQYXJhbXMudGl0bGU7XG4gIGNvbnN0IGluZm86IHN0cmluZyA9IGhhc05leHQgfHwgaGFzUHJldiA/IGBzaG93aW5nICR7b2Zmc2V0ICsgMX0gdG8gJHtlbmR9IG9mIHRvdGFsICR7dG90YWx9IGl0ZW1zYCA6IGB0b3RhbCAke3RvdGFsfSBpdGVtc2A7XG4gIGNvbnN0IF9jb2x1bW5zOiBzdHJpbmcgPSBzdGFuemFQYXJhbXMuY29sdW1uX25hbWVzO1xuICBjb25zdCBzaG93Q29sdW1uTmFtZXM6IGJvb2xlYW4gPSBfY29sdW1ucy50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIgPyBmYWxzZSA6IEJvb2xlYW4oc3RhbnphUGFyYW1zLmNvbHVtbl9uYW1lcyk7XG5cbiAgcmV0dXJuIHtcbiAgICB0aXRsZSxcbiAgICBvZmZzZXQsXG4gICAgY29sdW1uTGFiZWxzLFxuICAgIGRhdGEsXG4gICAgaGFzTmV4dCxcbiAgICBoYXNQcmV2LFxuICAgIGluZm8sXG4gICAgc2hvd0NvbHVtbk5hbWVzXG4gIH07XG59O1xuXG5jb25zdCBmZXRjaERhdGEgPSBhc3luYyh1cmw6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBQcm9taXNlPEFQSVJlc3BvbnNlPiA9PiB7XG4gIC8vIHJldHVybiBmZXRjaER1bW15KHF1ZXJ5LCBvZmZzZXQsIGxpbWl0KTtcbiAgcmV0dXJuIGZldGNoTGl2ZSh1cmwsIG9mZnNldCwgbGltaXQpO1xufTtcblxuY29uc3QgZmV0Y2hMaXZlID0gYXN5bmModXJsOiBzdHJpbmcsIG9mZnNldDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogUHJvbWlzZTxBUElSZXNwb25zZT4gPT4ge1xuICBjb25zdCBbdXJpLCBxdWVyeV06IFtzdHJpbmcsIHN0cmluZ10gPSBzZXBhcmF0ZVVSTCh1cmwpO1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgbWFrZU9wdGlvbnMoe29mZnNldCwgbGltaXR9LCBxdWVyeSkpO1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jb25zdCBmZXRjaER1bW15ID0gYXN5bmMocXVlcnk6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBQcm9taXNlPEFQSVJlc3BvbnNlPiA9PiB7XG4gIGF3YWl0IHRpbWVvdXQoMTAwMCk7XG4gIGNvbnN0IHRvdGFsOiBudW1iZXIgPSAyMjtcbiAgcmV0dXJuIHtcbiAgICB0b3RhbDogdG90YWwsXG4gICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgY29udGVudHM6IG1ha2VDb250ZW50cyhsaW1pdCwgb2Zmc2V0LCB0b3RhbCksXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBrZXk6IFwiaW5kZXhcIixcbiAgICAgICAgbGFiZWw6IFwiSU5ERVhcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogXCJnbV9pZFwiLFxuICAgICAgICBsYWJlbDogXCJHTSBJRFwiLFxuICAgICAgICBub3dyYXA6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IFwibmFtZVwiLFxuICAgICAgICBsYWJlbDogXCJOQU1FXCJcbiAgICAgIH0sXG4gICAgXVxuICB9O1xufTtcblxuXG5jb25zdCBtYWtlQ29udGVudHMgPSAoY291bnQ6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIsIHRvdGFsOiBudW1iZXIpOiBDb250ZW50W10gPT4ge1xuICBjb25zdCByZXN1bHQ6IENvbnRlbnRbXSA9IFtdO1xuICBjb25zdCBhY3R1YWxDb3VudCA9IGNvdW50ICsgb2Zmc2V0IDwgdG90YWwgPyBjb3VudCA6IHRvdGFsIC0gb2Zmc2V0ICsgMTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdHVhbENvdW50OyBpKyspIHtcbiAgICByZXN1bHQucHVzaCh7XG4gICAgICBpbmRleDogKGkgKyBvZmZzZXQpLnRvU3RyaW5nKCksXG4gICAgICBnbV9pZDoge1xuICAgICAgICBocmVmOiBcIi9tZWRpYS9TWTQzcVwiLFxuICAgICAgICBsYWJlbDogXCJTWTQzYVwiXG4gICAgICB9LFxuICAgICAgbmFtZTogXCJCTCBBR0FSIChHTFVDT1NFIEJMT09EIExJVkVSIEFHQVIpXCJcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgbWFrZUVtcHR5RGF0YSA9IChwYXJhbXM6IEhUTUxQYXJhbXMpOiBIVE1MUGFyYW1zID0+IHtcbiAgcmV0dXJuIHsuLi5wYXJhbXMsIGRhdGE6IFtdfTtcbn07XG5cblxuY29uc3QgdGltZW91dCA9IChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn07XG5cbmNvbnN0IHNlcGFyYXRlVVJMID0gKHVybDogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nXSA9PiB7XG4gIGNvbnN0IHNlcGFyYXRlZCA9IC8oLiopXFw/KC4qKS8uZXhlYyh1cmwpO1xuICBsZXQgdXJpLCBxdWVyeTtcbiAgaWYgKHNlcGFyYXRlZCkge1xuICAgIHVyaSA9IHNlcGFyYXRlZFsxXTtcbiAgICBxdWVyeSA9IHNlcGFyYXRlZFsyXTtcbiAgfSBlbHNlIHtcbiAgICB1cmkgPSB1cmw7XG4gICAgcXVlcnkgPSBcIlwiO1xuICB9XG4gIHJldHVybiBbdXJpLCBxdWVyeV07XG5cbn07XG5cbmNvbnN0IG1ha2VPcHRpb25zID0gKHBhcmFtczogYW55LCBxdWVyeTogc3RyaW5nKTogUmVxdWVzdEluaXQgPT4ge1xuICBsZXQgZm9ybUJvZHkgPSBbXTtcblxuICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvcm1Cb2R5LnB1c2goa2V5ICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tleV0pKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgYm9keSA9IGAke3F1ZXJ5fSYke2Zvcm1Cb2R5LmpvaW4oXCImXCIpfWA7XG5cbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIG1vZGU6IFwiY29yc1wiLFxuICAgIGJvZHksXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiXG4gICAgfVxuICB9O1xufTtcblxuXG50eXBlIEl0ZW0gPSBTdHJpbmdJdGVtIHwgTGlua0l0ZW07XG5cbmludGVyZmFjZSBTdGFuemFQYXJhbXMge1xuICBhcGlfdXJsOiBzdHJpbmc7XG4gIGxpbWl0OiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGNvbHVtbl9uYW1lczogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSFRNTFBhcmFtcyB7XG4gIGNvbHVtbkxhYmVsczogc3RyaW5nW107XG4gIGRhdGE6IEl0ZW1bXVtdO1xuICBvZmZzZXQ6IG51bWJlcjtcbiAgdGl0bGU6IHN0cmluZztcbiAgaGFzTmV4dDogYm9vbGVhbjtcbiAgaGFzUHJldjogYm9vbGVhbjtcbiAgaW5mbzogc3RyaW5nO1xuICBzaG93Q29sdW1uTmFtZXM6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBBUElSZXNwb25zZSB7XG4gIHRvdGFsOiBudW1iZXI7XG4gIG9mZnNldDogbnVtYmVyO1xuICBjb250ZW50czogQ29udGVudFtdO1xuICBjb2x1bW5zOiBDb2x1bW5bXTtcbn1cblxuaW50ZXJmYWNlIENvbnRlbnQge1xuICBba2V5OiBzdHJpbmddOiAoTGlua0l0ZW0gfCBzdHJpbmcpO1xufVxuXG5pbnRlcmZhY2UgTGlua0l0ZW0ge1xuICBocmVmOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIG5vd3JhcD86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTdHJpbmdJdGVtIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgbm93cmFwPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIENvbHVtbiB7XG4gIGtleTogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBub3dyYXA/OiBib29sZWFuO1xufVxuXG5cbiJdLCJzb3VyY2VSb290IjoiIn0=