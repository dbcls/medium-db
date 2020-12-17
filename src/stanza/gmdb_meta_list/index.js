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
        await movePage(stanza, htmlParams, stanzaParams, limit, DIRECTION.PREV);
    });
    (_b = stanza.select("#btnNext")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
        await movePage(stanza, htmlParams, stanzaParams, limit, DIRECTION.NEXT);
    });
};
const movePage = async (stanza, htmlParams, stanzaParams, limit, direction) => {
    render(stanza, { ...htmlParams, isLoading: true }, stanzaParams);
    const offset = htmlParams.offset + limit * direction;
    const data = await fetchData(stanzaParams.api_url, offset, limit);
    const params = processData(data, offset, stanzaParams);
    render(stanza, params, stanzaParams);
};
const processData = (response, offset, stanzaParams) => {
    switch (response.status) {
        case 200:
            return makeSuccessData(response, offset, stanzaParams);
        default:
            return makeFailParams(response, stanzaParams);
    }
};
const makeSuccessData = (response, offset, stanzaParams) => {
    const columnLabels = response.body.columns.map(item => item.label);
    const keys = response.body.columns.map(item => item.key);
    const noWraps = {};
    response.body.columns.forEach(item => noWraps[item.key] = item.nowrap);
    const data = response.body.contents.map(item => {
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
    const total = response.body.total;
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
        showColumnNames,
        status: 200,
        statusText: ""
    };
};
const makeFailParams = (response, stanzaParams) => {
    return {
        title: stanzaParams.title,
        offset: 0,
        columnLabels: null,
        data: null,
        hasNext: false,
        hasPrev: false,
        info: null,
        showColumnNames: false,
        status: response.status,
        statusText: response.message,
    };
};
const fetchData = async (url, offset, limit) => {
    return fetchLive(url, offset, limit);
};
const fetchLive = async (url, offset, limit) => {
    const [uri, query] = separateURL(url);
    const response = await fetch(uri, makeOptions({ offset, limit }, query));
    if (response.status !== 200) {
        return {
            status: response.status,
            message: response.statusText,
            body: null
        };
    }
    const body = await response.json();
    return {
        status: 200,
        body
    };
};
const fetchDummy = async (query, offset, limit) => {
    await timeout(1000);
    const total = 22;
    return {
        status: 200,
        body: {
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
        }
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
const filterQuery = (query) => {
    let isOmitted = false;
    const result = query.split("&").filter(str => {
        const reg = /(.*)=(.*)/.exec(str);
        const [key, value] = [reg[1], reg[2]];
        switch (key) {
            case "limit":
            case "offset":
                isOmitted = true;
                return false;
            default:
                return true;
        }
    }).join("&");
    if (isOmitted) {
        console.warn("limit and offset on API_URL have been omitted as they are set from the Stanza");
    }
    return result;
};
const makeOptions = (params, query) => {
    let formBody = [];
    for (let key in params) {
        if (params[key] !== undefined) {
            formBody.push(key + "=" + encodeURIComponent(params[key]));
        }
    }
    const body = `${filterQuery(query)}&${formBody.join("&")}`;
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
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["NEXT"] = 1] = "NEXT";
    DIRECTION[DIRECTION["PREV"] = -1] = "PREV";
})(DIRECTION || (DIRECTION = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxDQUFlLEtBQUssV0FBVSxNQUFNLEVBQUUsWUFBWTtJQUN0RCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RixNQUFNLFNBQVMsR0FBZSxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN0RSxNQUFNLENBQUMsTUFBTSxFQUFFLFNB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Q0FBQztJQUdsQixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtRQUN0QixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUQ7S0FDRjtJQUNELE1BQU0sSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUUzRCxPQUFPO1FBQ0wsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUk7UUFDSixPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLGNBQWMsRUFBRSxtQ0FBbUM7U0FDcEQ7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsSUFBSyxTQUdKO0FBSEQsV0FBSyxTQUFTO0lBQ1oseUNBQVE7SUFDUiwwQ0FBUztBQUNYLENBQUMsRUFISSxTQUFTLEtBQVQsU0FBUyxRQUdiIiwiZmlsZSI6ImdtZGJfbWV0YV9saXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc3RhbnphL2dtZGJfbWV0YV9saXN0L2luZGV4LnRzXCIpO1xuIiwiU3RhbnphPFN0YW56YVBhcmFtcz4oYXN5bmMgZnVuY3Rpb24oc3RhbnphLCBzdGFuemFQYXJhbXMpIHtcbiAgY29uc3Qgb2Zmc2V0OiBudW1iZXIgPSAwO1xuICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKHN0YW56YVBhcmFtcy5hcGlfdXJsLCBvZmZzZXQsIHBhcnNlSW50KHN0YW56YVBhcmFtcy5saW1pdCwgMTApKTtcbiAgY29uc3QgaHRtbFByYW1zOiBIVE1MUGFyYW1zID0gcHJvY2Vzc0RhdGEoZGF0YSwgb2Zmc2V0LCBzdGFuemFQYXJhbXMpO1xuICByZW5kZXIoc3RhbnphLCBodG1sUHJhbXMsIHN0YW56YVBhcmFtcyk7XG59KTtcblxuXG5jb25zdCByZW5kZXIgPSAoc3RhbnphOiBTdGFuemFJbnN0YW5jZSwgaHRtbFBhcmFtczogSFRNTFBhcmFtcywgc3RhbnphUGFyYW1zOiBTdGFuemFQYXJhbXMpID0+IHtcbiAgY29uc3QgbGltaXQ6IG51bWJlciA9IHBhcnNlSW50KHN0YW56YVBhcmFtcy5saW1pdCwgMTApO1xuICBzdGFuemEucmVuZGVyKHtcbiAgICB0ZW1wbGF0ZTogXCJzdGFuemEuaHRtbFwiLFxuICAgIHBhcmFtZXRlcnM6IGh0bWxQYXJhbXNcbiAgfSk7XG4gIHN0YW56YS5zZWxlY3QoXCIjYnRuUHJldlwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jKCkgPT4ge1xuICAgIGF3YWl0IG1vdmVQYWdlKHN0YW56YSwgaHRtbFBhcmFtcywgc3RhbnphUGFyYW1zLCBsaW1pdCwgRElSRUNUSU9OLlBSRVYpO1xuICB9KTtcbiAgc3RhbnphLnNlbGVjdChcIiNidG5OZXh0XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMoKSA9PiB7XG4gICAgYXdhaXQgbW92ZVBhZ2Uoc3RhbnphLCBodG1sUGFyYW1zLCBzdGFuemFQYXJhbXMsIGxpbWl0LCBESVJFQ1RJT04uTkVYVCk7XG4gIH0pO1xufTtcblxuY29uc3QgbW92ZVBhZ2UgPSBhc3luYyhzdGFuemE6IFN0YW56YUluc3RhbmNlLCBodG1sUGFyYW1zOiBIVE1MUGFyYW1zLCBzdGFuemFQYXJhbXM6IFN0YW56YVBhcmFtcywgbGltaXQ6IG51bWJlciwgZGlyZWN0aW9uOiBESVJFQ1RJT04pID0+IHtcbiAgcmVuZGVyKHN0YW56YSwgey4uLmh0bWxQYXJhbXMsIGlzTG9hZGluZzogdHJ1ZX0sIHN0YW56YVBhcmFtcyk7XG4gIGNvbnN0IG9mZnNldCA9IGh0bWxQYXJhbXMub2Zmc2V0ICsgbGltaXQgKiBkaXJlY3Rpb247XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaERhdGEoc3RhbnphUGFyYW1zLmFwaV91cmwsIG9mZnNldCwgbGltaXQpO1xuICBjb25zdCBwYXJhbXM6IEhUTUxQYXJhbXMgPSBwcm9jZXNzRGF0YShkYXRhLCBvZmZzZXQsIHN0YW56YVBhcmFtcyk7XG4gIHJlbmRlcihzdGFuemEsIHBhcmFtcywgc3RhbnphUGFyYW1zKTtcbn07XG5cbmNvbnN0IHByb2Nlc3NEYXRhID0gKHJlc3BvbnNlOiBBUElSZXNwb25zZSwgb2Zmc2V0OiBudW1iZXIsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zKTogSFRNTFBhcmFtcyA9PiB7XG4gIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgY2FzZSAyMDA6XG4gICAgICByZXR1cm4gbWFrZVN1Y2Nlc3NEYXRhKHJlc3BvbnNlLCBvZmZzZXQsIHN0YW56YVBhcmFtcyk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtYWtlRmFpbFBhcmFtcyhyZXNwb25zZSwgc3RhbnphUGFyYW1zKTtcbiAgfVxufTtcblxuY29uc3QgbWFrZVN1Y2Nlc3NEYXRhID0gKHJlc3BvbnNlOiBBUElSZXNwb25zZSwgb2Zmc2V0OiBudW1iZXIsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zKTogSFRNTFBhcmFtcyA9PiB7XG4gIGNvbnN0IGNvbHVtbkxhYmVsczogc3RyaW5nW10gPSByZXNwb25zZS5ib2R5LmNvbHVtbnMubWFwKGl0ZW0gPT4gaXRlbS5sYWJlbCk7XG4gIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gcmVzcG9uc2UuYm9keS5jb2x1bW5zLm1hcChpdGVtID0+IGl0ZW0ua2V5KTtcbiAgY29uc3Qgbm9XcmFwczoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG4gIHJlc3BvbnNlLmJvZHkuY29sdW1ucy5mb3JFYWNoKGl0ZW0gPT4gbm9XcmFwc1tpdGVtLmtleV0gPSBpdGVtLm5vd3JhcCk7XG4gIGNvbnN0IGRhdGE6IEl0ZW1bXVtdID0gcmVzcG9uc2UuYm9keS5jb250ZW50cy5tYXAoaXRlbSA9PiB7XG4gICAgY29uc3QgcmVzdWx0OiBJdGVtW10gPSBbXTtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGxldCB2YWx1ZTogU3RyaW5nSXRlbTtcbiAgICAgIGlmICh0eXBlb2YgaXRlbVtrZXldID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhbHVlID0ge2xhYmVsOiBpdGVtW2tleV0gYXMgc3RyaW5nfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gaXRlbVtrZXldIGFzIExpbmtJdGVtO1xuICAgICAgfVxuICAgICAgaWYgKG5vV3JhcHNba2V5XSkge1xuICAgICAgICB2YWx1ZS5ub3dyYXAgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuICBjb25zdCB0b3RhbDogbnVtYmVyID0gcmVzcG9uc2UuYm9keS50b3RhbDtcbiAgY29uc3QgX2VuZDogbnVtYmVyID0gcGFyc2VJbnQoc3RhbnphUGFyYW1zLmxpbWl0LCAxMCkgKyBvZmZzZXQ7XG4gIGNvbnN0IGVuZDogbnVtYmVyID0gX2VuZCA8PSB0b3RhbCA/IF9lbmQgOiB0b3RhbDtcbiAgY29uc3QgaGFzUHJldjogYm9vbGVhbiA9IG9mZnNldCAhPT0gMDtcbiAgY29uc3QgaGFzTmV4dDogYm9vbGVhbiA9IGVuZCA8IHRvdGFsO1xuICBjb25zdCB0aXRsZTogc3RyaW5nID0gc3RhbnphUGFyYW1zLnRpdGxlO1xuICBjb25zdCBpbmZvOiBzdHJpbmcgPSBoYXNOZXh0IHx8IGhhc1ByZXYgPyBgc2hvd2luZyAke29mZnNldCArIDF9IHRvICR7ZW5kfSBvZiB0b3RhbCAke3RvdGFsfSBpdGVtc2AgOiBgdG90YWwgJHt0b3RhbH0gaXRlbXNgO1xuICBjb25zdCBfY29sdW1uczogc3RyaW5nID0gc3RhbnphUGFyYW1zLmNvbHVtbl9uYW1lcztcbiAgY29uc3Qgc2hvd0NvbHVtbk5hbWVzOiBib29sZWFuID0gX2NvbHVtbnMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiBCb29sZWFuKHN0YW56YVBhcmFtcy5jb2x1bW5fbmFtZXMpO1xuXG4gIHJldHVybiB7XG4gICAgdGl0bGUsXG4gICAgb2Zmc2V0LFxuICAgIGNvbHVtbkxhYmVscyxcbiAgICBkYXRhLFxuICAgIGhhc05leHQsXG4gICAgaGFzUHJldixcbiAgICBpbmZvLFxuICAgIHNob3dDb2x1bW5OYW1lcyxcbiAgICBzdGF0dXM6IDIwMCxcbiAgICBzdGF0dXNUZXh0OiBcIlwiXG4gIH07XG59O1xuXG5jb25zdCBtYWtlRmFpbFBhcmFtcyA9IChyZXNwb25zZTogQVBJUmVzcG9uc2UsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zKTogSFRNTFBhcmFtcyA9PiB7XG4gIHJldHVybiB7XG4gICAgdGl0bGU6IHN0YW56YVBhcmFtcy50aXRsZSxcbiAgICBvZmZzZXQ6IDAsXG4gICAgY29sdW1uTGFiZWxzOiBudWxsLFxuICAgIGRhdGE6IG51bGwsXG4gICAgaGFzTmV4dDogZmFsc2UsXG4gICAgaGFzUHJldjogZmFsc2UsXG4gICAgaW5mbzogbnVsbCxcbiAgICBzaG93Q29sdW1uTmFtZXM6IGZhbHNlLFxuICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLm1lc3NhZ2UsXG4gIH07XG5cbn07XG5cbmNvbnN0IGZldGNoRGF0YSA9IGFzeW5jKHVybDogc3RyaW5nLCBvZmZzZXQ6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IFByb21pc2U8QVBJUmVzcG9uc2U+ID0+IHtcbiAgLy8gcmV0dXJuIGZldGNoRHVtbXkocXVlcnksIG9mZnNldCwgbGltaXQpO1xuICByZXR1cm4gZmV0Y2hMaXZlKHVybCwgb2Zmc2V0LCBsaW1pdCk7XG59O1xuXG5jb25zdCBmZXRjaExpdmUgPSBhc3luYyh1cmw6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBQcm9taXNlPEFQSVJlc3BvbnNlPiA9PiB7XG4gIGNvbnN0IFt1cmksIHF1ZXJ5XTogW3N0cmluZywgc3RyaW5nXSA9IHNlcGFyYXRlVVJMKHVybCk7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBtYWtlT3B0aW9ucyh7b2Zmc2V0LCBsaW1pdH0sIHF1ZXJ5KSk7XG4gIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIG1lc3NhZ2U6IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICBib2R5OiBudWxsXG4gICAgfTtcbiAgfVxuICBjb25zdCBib2R5OiBhbnkgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiAyMDAsXG4gICAgYm9keVxuICB9O1xufTtcblxuY29uc3QgZmV0Y2hEdW1teSA9IGFzeW5jKHF1ZXJ5OiBzdHJpbmcsIG9mZnNldDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogUHJvbWlzZTxBUElSZXNwb25zZT4gPT4ge1xuICBhd2FpdCB0aW1lb3V0KDEwMDApO1xuICBjb25zdCB0b3RhbDogbnVtYmVyID0gMjI7XG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiAyMDAsXG4gICAgYm9keToge1xuICAgICAgdG90YWw6IHRvdGFsLFxuICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICBjb250ZW50czogbWFrZUNvbnRlbnRzKGxpbWl0LCBvZmZzZXQsIHRvdGFsKSxcbiAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogXCJpbmRleFwiLFxuICAgICAgICAgIGxhYmVsOiBcIklOREVYXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6IFwiZ21faWRcIixcbiAgICAgICAgICBsYWJlbDogXCJHTSBJRFwiLFxuICAgICAgICAgIG5vd3JhcDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogXCJuYW1lXCIsXG4gICAgICAgICAgbGFiZWw6IFwiTkFNRVwiXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfVxuICB9O1xufTtcblxuXG5jb25zdCBtYWtlQ29udGVudHMgPSAoY291bnQ6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIsIHRvdGFsOiBudW1iZXIpOiBDb250ZW50W10gPT4ge1xuICBjb25zdCByZXN1bHQ6IENvbnRlbnRbXSA9IFtdO1xuICBjb25zdCBhY3R1YWxDb3VudCA9IGNvdW50ICsgb2Zmc2V0IDwgdG90YWwgPyBjb3VudCA6IHRvdGFsIC0gb2Zmc2V0ICsgMTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdHVhbENvdW50OyBpKyspIHtcbiAgICByZXN1bHQucHVzaCh7XG4gICAgICBpbmRleDogKGkgKyBvZmZzZXQpLnRvU3RyaW5nKCksXG4gICAgICBnbV9pZDoge1xuICAgICAgICBocmVmOiBcIi9tZWRpYS9TWTQzcVwiLFxuICAgICAgICBsYWJlbDogXCJTWTQzYVwiXG4gICAgICB9LFxuICAgICAgbmFtZTogXCJCTCBBR0FSIChHTFVDT1NFIEJMT09EIExJVkVSIEFHQVIpXCJcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgbWFrZUVtcHR5RGF0YSA9IChwYXJhbXM6IEhUTUxQYXJhbXMpOiBIVE1MUGFyYW1zID0+IHtcbiAgcmV0dXJuIHsuLi5wYXJhbXMsIGRhdGE6IFtdfTtcbn07XG5cbmNvbnN0IHRpbWVvdXQgPSAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59O1xuXG5jb25zdCBzZXBhcmF0ZVVSTCA9ICh1cmw6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ10gPT4ge1xuICBjb25zdCBzZXBhcmF0ZWQgPSAvKC4qKVxcPyguKikvLmV4ZWModXJsKTtcbiAgbGV0IHVyaSwgcXVlcnk7XG4gIGlmIChzZXBhcmF0ZWQpIHtcbiAgICB1cmkgPSBzZXBhcmF0ZWRbMV07XG4gICAgcXVlcnkgPSBzZXBhcmF0ZWRbMl07XG4gIH0gZWxzZSB7XG4gICAgdXJpID0gdXJsO1xuICAgIHF1ZXJ5ID0gXCJcIjtcbiAgfVxuICByZXR1cm4gW3VyaSwgcXVlcnldO1xufTtcblxuY29uc3QgZmlsdGVyUXVlcnkgPSAocXVlcnk6IHN0cmluZyk6IHN0cmluZyA9PiB7XG5cbiAgLy8gY29uc29sZS5sb2cocXVlcnkpO1xuICBsZXQgaXNPbWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGNvbnN0IHJlc3VsdDogc3RyaW5nID0gcXVlcnkuc3BsaXQoXCImXCIpLmZpbHRlcihzdHIgPT4ge1xuICAgIGNvbnN0IHJlZyA9IC8oLiopPSguKikvLmV4ZWMoc3RyKTtcbiAgICBjb25zdCBba2V5LCB2YWx1ZV06IFtzdHJpbmcsIHN0cmluZ10gPSBbcmVnWzFdLCByZWdbMl1dO1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIFwibGltaXRcIjpcbiAgICAgIGNhc2UgXCJvZmZzZXRcIjpcbiAgICAgICAgaXNPbWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KS5qb2luKFwiJlwiKTtcbiAgaWYgKGlzT21pdHRlZCkge1xuICAgIGNvbnNvbGUud2FybihcImxpbWl0IGFuZCBvZmZzZXQgb24gQVBJX1VSTCBoYXZlIGJlZW4gb21pdHRlZCBhcyB0aGV5IGFyZSBzZXQgZnJvbSB0aGUgU3RhbnphXCIpO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbmNvbnN0IG1ha2VPcHRpb25zID0gKHBhcmFtczogYW55LCBxdWVyeTogc3RyaW5nKTogUmVxdWVzdEluaXQgPT4ge1xuICBsZXQgZm9ybUJvZHkgPSBbXTtcblxuXG4gIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9ybUJvZHkucHVzaChrZXkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba2V5XSkpO1xuICAgIH1cbiAgfVxuICBjb25zdCBib2R5ID0gYCR7ZmlsdGVyUXVlcnkocXVlcnkpfSYke2Zvcm1Cb2R5LmpvaW4oXCImXCIpfWA7XG5cbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIG1vZGU6IFwiY29yc1wiLFxuICAgIGJvZHksXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiXG4gICAgfVxuICB9O1xufTtcblxuZW51bSBESVJFQ1RJT04ge1xuICBORVhUID0gMSxcbiAgUFJFViA9IC0xXG59XG5cblxudHlwZSBJdGVtID0gU3RyaW5nSXRlbSB8IExpbmtJdGVtO1xuXG5pbnRlcmZhY2UgU3RhbnphUGFyYW1zIHtcbiAgYXBpX3VybDogc3RyaW5nO1xuICBsaW1pdDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjb2x1bW5fbmFtZXM6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEhUTUxQYXJhbXMge1xuICBjb2x1bW5MYWJlbHM6IHN0cmluZ1tdO1xuICBkYXRhOiBJdGVtW11bXTtcbiAgb2Zmc2V0OiBudW1iZXI7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGhhc05leHQ6IGJvb2xlYW47XG4gIGhhc1ByZXY6IGJvb2xlYW47XG4gIGluZm86IHN0cmluZztcbiAgc2hvd0NvbHVtbk5hbWVzOiBib29sZWFuO1xuICBpc0xvYWRpbmc/OiBib29sZWFuO1xuICBzdGF0dXM6IG51bWJlcjtcbiAgc3RhdHVzVGV4dDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQVBJUmVzcG9uc2Uge1xuICBzdGF0dXM6IG51bWJlcjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgYm9keToge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgY29udGVudHM6IENvbnRlbnRbXTtcbiAgICBjb2x1bW5zOiBDb2x1bW5bXTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIENvbnRlbnQge1xuICBba2V5OiBzdHJpbmddOiAoTGlua0l0ZW0gfCBzdHJpbmcpO1xufVxuXG5pbnRlcmZhY2UgTGlua0l0ZW0ge1xuICBocmVmOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIG5vd3JhcD86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTdHJpbmdJdGVtIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgbm93cmFwPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIENvbHVtbiB7XG4gIGtleTogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBub3dyYXA/OiBib29sZWFuO1xufVxuXG5cbiJdLCJzb3VyY2VSb290IjoiIn0=