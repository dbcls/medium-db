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
    const data = await fetchData(stanzaParams.api_url, stanzaParams.keyword, offset, parseInt(stanzaParams.limit, 10));
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
        const data = await fetchData(stanzaParams.api_url, stanzaParams.keyword, offset, limit);
        const params = processData(data, offset, stanzaParams);
        render(stanza, params, stanzaParams);
    });
    (_b = stanza.select("#btnNext")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
        render(stanza, makeEmptyData(htmlParams), stanzaParams);
        const offset = htmlParams.offset + limit;
        const data = await fetchData(stanzaParams.api_url, stanzaParams.keyword, offset, limit);
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
    const title = stanzaParams.title.replace(/#keyword#/, `"${stanzaParams.keyword}"`);
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
const fetchData = async (url, query, offset, limit) => {
    return fetchLive(url, query, offset, limit);
};
const fetchLive = async (url, query, offset, limit) => {
    const response = await fetch(url, makeOptions({ keyword: query, offset, limit }));
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
const makeOptions = (params) => {
    let formBody = [];
    for (let key in params) {
        if (params[key] !== undefined) {
            formBody.push(key + "=" + encodeURIComponent(params[key]));
        }
    }
    return {
        method: "POST",
        mode: "cors",
        body: formBody.join("&"),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxDQUFlLEtBQUssV0FBVSxNQUFNLEVBQUUsWUFBWTtJQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ1osUUFBUSxFQUFFLGFBQWE7UUFDdkIsVUFBVSxFQUFFLEVBQUU7S0FDZixDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FB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QUFPLENBQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFXLEVBQWUsRUFBRTtJQUMvQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFFbEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7UUFDdEIsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzdCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVEO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUN4QixPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLGNBQWMsRUFBRSxtQ0FBbUM7U0FDcEQ7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6ImdtZGJfbWV0YV9saXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc3RhbnphL2dtZGJfbWV0YV9saXN0L2luZGV4LnRzXCIpO1xuIiwiU3RhbnphPFN0YW56YVBhcmFtcz4oYXN5bmMgZnVuY3Rpb24oc3RhbnphLCBzdGFuemFQYXJhbXMpIHtcbiAgc3RhbnphLnJlbmRlcih7XG4gICAgdGVtcGxhdGU6IFwic3RhbnphLmh0bWxcIixcbiAgICBwYXJhbWV0ZXJzOiB7fVxuICB9KTtcbiAgY29uc3Qgb2Zmc2V0OiBudW1iZXIgPSAwO1xuICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKHN0YW56YVBhcmFtcy5hcGlfdXJsLCBzdGFuemFQYXJhbXMua2V5d29yZCwgb2Zmc2V0LCBwYXJzZUludChzdGFuemFQYXJhbXMubGltaXQsIDEwKSk7XG4gIGNvbnN0IGh0bWxQcmFtczogSFRNTFBhcmFtcyA9IHByb2Nlc3NEYXRhKGRhdGEsIG9mZnNldCwgc3RhbnphUGFyYW1zKTtcbiAgcmVuZGVyKHN0YW56YSwgaHRtbFByYW1zLCBzdGFuemFQYXJhbXMpO1xufSk7XG5cblxuY29uc3QgcmVuZGVyID0gKHN0YW56YTogU3RhbnphSW5zdGFuY2UsIGh0bWxQYXJhbXM6IEhUTUxQYXJhbXMsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zKSA9PiB7XG4gIGNvbnN0IGxpbWl0OiBudW1iZXIgPSBwYXJzZUludChzdGFuemFQYXJhbXMubGltaXQsIDEwKTtcbiAgc3RhbnphLnJlbmRlcih7XG4gICAgdGVtcGxhdGU6IFwic3RhbnphLmh0bWxcIixcbiAgICBwYXJhbWV0ZXJzOiBodG1sUGFyYW1zXG4gIH0pO1xuICBzdGFuemEuc2VsZWN0KFwiI2J0blByZXZcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYygpID0+IHtcbiAgICByZW5kZXIoc3RhbnphLCBtYWtlRW1wdHlEYXRhKGh0bWxQYXJhbXMpLCBzdGFuemFQYXJhbXMpO1xuICAgIGNvbnN0IG9mZnNldCA9IGh0bWxQYXJhbXMub2Zmc2V0IC0gbGltaXQ7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShzdGFuemFQYXJhbXMuYXBpX3VybCwgc3RhbnphUGFyYW1zLmtleXdvcmQsIG9mZnNldCwgbGltaXQpO1xuICAgIGNvbnN0IHBhcmFtczogSFRNTFBhcmFtcyA9IHByb2Nlc3NEYXRhKGRhdGEsIG9mZnNldCwgc3RhbnphUGFyYW1zKTtcbiAgICByZW5kZXIoc3RhbnphLCBwYXJhbXMsIHN0YW56YVBhcmFtcyk7XG4gIH0pO1xuICBzdGFuemEuc2VsZWN0KFwiI2J0bk5leHRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYygpID0+IHtcbiAgICByZW5kZXIoc3RhbnphLCBtYWtlRW1wdHlEYXRhKGh0bWxQYXJhbXMpLCBzdGFuemFQYXJhbXMpO1xuICAgIGNvbnN0IG9mZnNldCA9IGh0bWxQYXJhbXMub2Zmc2V0ICsgbGltaXQ7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShzdGFuemFQYXJhbXMuYXBpX3VybCwgc3RhbnphUGFyYW1zLmtleXdvcmQsIG9mZnNldCwgbGltaXQpO1xuICAgIGNvbnN0IHBhcmFtczogSFRNTFBhcmFtcyA9IHByb2Nlc3NEYXRhKGRhdGEsIG9mZnNldCwgc3RhbnphUGFyYW1zKTtcbiAgICByZW5kZXIoc3RhbnphLCBwYXJhbXMsIHN0YW56YVBhcmFtcyk7XG4gIH0pO1xufTtcblxuY29uc3QgcHJvY2Vzc0RhdGEgPSAocmVzcG9uc2U6IEFQSVJlc3BvbnNlLCBvZmZzZXQ6IG51bWJlciwgc3RhbnphUGFyYW1zOiBTdGFuemFQYXJhbXMpOiBIVE1MUGFyYW1zID0+IHtcbiAgY29uc3QgY29sdW1uTGFiZWxzOiBzdHJpbmdbXSA9IHJlc3BvbnNlLmNvbHVtbnMubWFwKGl0ZW0gPT4gaXRlbS5sYWJlbCk7XG4gIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gcmVzcG9uc2UuY29sdW1ucy5tYXAoaXRlbSA9PiBpdGVtLmtleSk7XG4gIGNvbnN0IG5vV3JhcHM6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuICByZXNwb25zZS5jb2x1bW5zLmZvckVhY2goaXRlbSA9PiBub1dyYXBzW2l0ZW0ua2V5XSA9IGl0ZW0ubm93cmFwKTtcbiAgY29uc3QgZGF0YTogSXRlbVtdW10gPSByZXNwb25zZS5jb250ZW50cy5tYXAoaXRlbSA9PiB7XG4gICAgY29uc3QgcmVzdWx0OiBJdGVtW10gPSBbXTtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGxldCB2YWx1ZTogU3RyaW5nSXRlbTtcbiAgICAgIGlmICh0eXBlb2YgaXRlbVtrZXldID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhbHVlID0ge2xhYmVsOiBpdGVtW2tleV0gYXMgc3RyaW5nfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gaXRlbVtrZXldIGFzIExpbmtJdGVtO1xuICAgICAgfVxuICAgICAgaWYgKG5vV3JhcHNba2V5XSkge1xuICAgICAgICB2YWx1ZS5ub3dyYXAgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuICBjb25zdCB0b3RhbDogbnVtYmVyID0gcmVzcG9uc2UudG90YWw7XG4gIGNvbnN0IF9lbmQ6IG51bWJlciA9IHBhcnNlSW50KHN0YW56YVBhcmFtcy5saW1pdCwgMTApICsgb2Zmc2V0O1xuICBjb25zdCBlbmQ6IG51bWJlciA9IF9lbmQgPD0gdG90YWwgPyBfZW5kIDogdG90YWw7XG4gIGNvbnN0IGhhc1ByZXY6IGJvb2xlYW4gPSBvZmZzZXQgIT09IDA7XG4gIGNvbnN0IGhhc05leHQ6IGJvb2xlYW4gPSBlbmQgPCB0b3RhbDtcbiAgY29uc3QgdGl0bGU6IHN0cmluZyA9IHN0YW56YVBhcmFtcy50aXRsZS5yZXBsYWNlKC8ja2V5d29yZCMvLCBgXCIke3N0YW56YVBhcmFtcy5rZXl3b3JkfVwiYCk7XG4gIGNvbnN0IGluZm86IHN0cmluZyA9IGhhc05leHQgfHwgaGFzUHJldiA/IGBzaG93aW5nICR7b2Zmc2V0ICsgMX0gdG8gJHtlbmR9IG9mIHRvdGFsICR7dG90YWx9IGl0ZW1zYCA6IGB0b3RhbCAke3RvdGFsfSBpdGVtc2A7XG4gIGNvbnN0IF9jb2x1bW5zOiBzdHJpbmcgPSBzdGFuemFQYXJhbXMuY29sdW1uX25hbWVzO1xuICBjb25zdCBzaG93Q29sdW1uTmFtZXM6IGJvb2xlYW4gPSBfY29sdW1ucy50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIgPyBmYWxzZSA6IEJvb2xlYW4oc3RhbnphUGFyYW1zLmNvbHVtbl9uYW1lcyk7XG5cbiAgcmV0dXJuIHtcbiAgICB0aXRsZSxcbiAgICBvZmZzZXQsXG4gICAgY29sdW1uTGFiZWxzLFxuICAgIGRhdGEsXG4gICAgaGFzTmV4dCxcbiAgICBoYXNQcmV2LFxuICAgIGluZm8sXG4gICAgc2hvd0NvbHVtbk5hbWVzXG4gIH07XG59O1xuXG5jb25zdCBmZXRjaERhdGEgPSBhc3luYyh1cmw6IHN0cmluZywgcXVlcnk6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBQcm9taXNlPEFQSVJlc3BvbnNlPiA9PiB7XG4gIC8vIHJldHVybiBmZXRjaER1bW15KHF1ZXJ5LCBvZmZzZXQsIGxpbWl0KTtcbiAgcmV0dXJuIGZldGNoTGl2ZSh1cmwsIHF1ZXJ5LCBvZmZzZXQsIGxpbWl0KTtcbn07XG5cbmNvbnN0IGZldGNoTGl2ZSA9IGFzeW5jKHVybDogc3RyaW5nLCBxdWVyeTogc3RyaW5nLCBvZmZzZXQ6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IFByb21pc2U8QVBJUmVzcG9uc2U+ID0+IHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG1ha2VPcHRpb25zKHtrZXl3b3JkOiBxdWVyeSwgb2Zmc2V0LCBsaW1pdH0pKTtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgZmV0Y2hEdW1teSA9IGFzeW5jKHF1ZXJ5OiBzdHJpbmcsIG9mZnNldDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogUHJvbWlzZTxBUElSZXNwb25zZT4gPT4ge1xuICBhd2FpdCB0aW1lb3V0KDEwMDApO1xuICBjb25zdCB0b3RhbDogbnVtYmVyID0gMjI7XG4gIHJldHVybiB7XG4gICAgdG90YWw6IHRvdGFsLFxuICAgIG9mZnNldDogb2Zmc2V0LFxuICAgIGNvbnRlbnRzOiBtYWtlQ29udGVudHMobGltaXQsIG9mZnNldCwgdG90YWwpLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiBcImluZGV4XCIsXG4gICAgICAgIGxhYmVsOiBcIklOREVYXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IFwiZ21faWRcIixcbiAgICAgICAgbGFiZWw6IFwiR00gSURcIixcbiAgICAgICAgbm93cmFwOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiBcIm5hbWVcIixcbiAgICAgICAgbGFiZWw6IFwiTkFNRVwiXG4gICAgICB9LFxuICAgIF1cbiAgfTtcbn07XG5cblxuY29uc3QgbWFrZUNvbnRlbnRzID0gKGNvdW50OiBudW1iZXIsIG9mZnNldDogbnVtYmVyLCB0b3RhbDogbnVtYmVyKTogQ29udGVudFtdID0+IHtcbiAgY29uc3QgcmVzdWx0OiBDb250ZW50W10gPSBbXTtcbiAgY29uc3QgYWN0dWFsQ291bnQgPSBjb3VudCArIG9mZnNldCA8IHRvdGFsID8gY291bnQgOiB0b3RhbCAtIG9mZnNldCArIDE7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3R1YWxDb3VudDsgaSsrKSB7XG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgaW5kZXg6IChpICsgb2Zmc2V0KS50b1N0cmluZygpLFxuICAgICAgZ21faWQ6IHtcbiAgICAgICAgaHJlZjogXCIvbWVkaWEvU1k0M3FcIixcbiAgICAgICAgbGFiZWw6IFwiU1k0M2FcIlxuICAgICAgfSxcbiAgICAgIG5hbWU6IFwiQkwgQUdBUiAoR0xVQ09TRSBCTE9PRCBMSVZFUiBBR0FSKVwiXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IG1ha2VFbXB0eURhdGEgPSAocGFyYW1zOiBIVE1MUGFyYW1zKTogSFRNTFBhcmFtcyA9PiB7XG4gIHJldHVybiB7Li4ucGFyYW1zLCBkYXRhOiBbXX07XG59O1xuXG5cbmNvbnN0IHRpbWVvdXQgPSAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59O1xuXG5jb25zdCBtYWtlT3B0aW9ucyA9IChwYXJhbXM6IGFueSk6IFJlcXVlc3RJbml0ID0+IHtcbiAgbGV0IGZvcm1Cb2R5ID0gW107XG5cbiAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgIGlmIChwYXJhbXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3JtQm9keS5wdXNoKGtleSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trZXldKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIG1vZGU6IFwiY29yc1wiLFxuICAgIGJvZHk6IGZvcm1Cb2R5LmpvaW4oXCImXCIpLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIlxuICAgIH1cbiAgfTtcbn07XG5cblxudHlwZSBJdGVtID0gU3RyaW5nSXRlbSB8IExpbmtJdGVtO1xuXG5pbnRlcmZhY2UgU3RhbnphUGFyYW1zIHtcbiAgYXBpX3VybDogc3RyaW5nO1xuICBrZXl3b3JkOiBzdHJpbmc7XG4gIGxpbWl0OiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGNvbHVtbl9uYW1lczogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSFRNTFBhcmFtcyB7XG4gIGNvbHVtbkxhYmVsczogc3RyaW5nW107XG4gIGRhdGE6IEl0ZW1bXVtdO1xuICBvZmZzZXQ6IG51bWJlcjtcbiAgdGl0bGU6IHN0cmluZztcbiAgaGFzTmV4dDogYm9vbGVhbjtcbiAgaGFzUHJldjogYm9vbGVhbjtcbiAgaW5mbzogc3RyaW5nO1xuICBzaG93Q29sdW1uTmFtZXM6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBBUElSZXNwb25zZSB7XG4gIHRvdGFsOiBudW1iZXI7XG4gIG9mZnNldDogbnVtYmVyO1xuICBjb250ZW50czogQ29udGVudFtdO1xuICBjb2x1bW5zOiBDb2x1bW5bXTtcbn1cblxuaW50ZXJmYWNlIENvbnRlbnQge1xuICBba2V5OiBzdHJpbmddOiAoTGlua0l0ZW0gfCBzdHJpbmcpO1xufVxuXG5pbnRlcmZhY2UgTGlua0l0ZW0ge1xuICBocmVmOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIG5vd3JhcD86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTdHJpbmdJdGVtIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgbm93cmFwPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIENvbHVtbiB7XG4gIGtleTogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBub3dyYXA/OiBib29sZWFuO1xufVxuXG5cbiJdLCJzb3VyY2VSb290IjoiIn0=