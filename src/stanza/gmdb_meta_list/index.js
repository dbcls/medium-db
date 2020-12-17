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
        await movePage(stanza, htmlParams, stanzaParams, limit * -1);
    });
    (_b = stanza.select("#btnNext")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
        await movePage(stanza, htmlParams, stanzaParams, limit);
    });
};
const movePage = async (stanza, htmlParams, stanzaParams, limit) => {
    render(stanza, { ...htmlParams, isLoading: true }, stanzaParams);
    const offset = htmlParams.offset + limit;
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxDQUFlLEtBQUssV0FBVSxNQUFNLEVBQUUsWUFBWTtJQUN0RCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RixNQUFNLFNBQVMsR0FBZSxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN0RSxNQUFNLENBQUMsTUFBTSxFQUFFLFNB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LElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUM3QixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RDtLQUNGO0lBQ0QsTUFBTSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBRTNELE9BQU87UUFDTCxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSTtRQUNKLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsY0FBYyxFQUFFLG1DQUFtQztTQUNwRDtLQUNGLENBQUM7QUFDSixDQUFDLENBQUMiLCJmaWxlIjoiZ21kYl9tZXRhX2xpc3QvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9zdGFuemEvZ21kYl9tZXRhX2xpc3QvaW5kZXgudHNcIik7XG4iLCJTdGFuemE8U3RhbnphUGFyYW1zPihhc3luYyBmdW5jdGlvbihzdGFuemEsIHN0YW56YVBhcmFtcykge1xuICBjb25zdCBvZmZzZXQ6IG51bWJlciA9IDA7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaERhdGEoc3RhbnphUGFyYW1zLmFwaV91cmwsIG9mZnNldCwgcGFyc2VJbnQoc3RhbnphUGFyYW1zLmxpbWl0LCAxMCkpO1xuICBjb25zdCBodG1sUHJhbXM6IEhUTUxQYXJhbXMgPSBwcm9jZXNzRGF0YShkYXRhLCBvZmZzZXQsIHN0YW56YVBhcmFtcyk7XG4gIHJlbmRlcihzdGFuemEsIGh0bWxQcmFtcywgc3RhbnphUGFyYW1zKTtcbn0pO1xuXG5cbmNvbnN0IHJlbmRlciA9IChzdGFuemE6IFN0YW56YUluc3RhbmNlLCBodG1sUGFyYW1zOiBIVE1MUGFyYW1zLCBzdGFuemFQYXJhbXM6IFN0YW56YVBhcmFtcykgPT4ge1xuICBjb25zdCBsaW1pdDogbnVtYmVyID0gcGFyc2VJbnQoc3RhbnphUGFyYW1zLmxpbWl0LCAxMCk7XG4gIHN0YW56YS5yZW5kZXIoe1xuICAgIHRlbXBsYXRlOiBcInN0YW56YS5odG1sXCIsXG4gICAgcGFyYW1ldGVyczogaHRtbFBhcmFtc1xuICB9KTtcbiAgc3RhbnphLnNlbGVjdChcIiNidG5QcmV2XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMoKSA9PiB7XG4gICAgYXdhaXQgbW92ZVBhZ2Uoc3RhbnphLCBodG1sUGFyYW1zLCBzdGFuemFQYXJhbXMsIGxpbWl0ICogLTEpO1xuICB9KTtcbiAgc3RhbnphLnNlbGVjdChcIiNidG5OZXh0XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMoKSA9PiB7XG4gICAgYXdhaXQgbW92ZVBhZ2Uoc3RhbnphLCBodG1sUGFyYW1zLCBzdGFuemFQYXJhbXMsIGxpbWl0KTtcbiAgfSk7XG59O1xuXG5jb25zdCBtb3ZlUGFnZSA9IGFzeW5jKHN0YW56YTogU3RhbnphSW5zdGFuY2UsIGh0bWxQYXJhbXM6IEhUTUxQYXJhbXMsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zLCBsaW1pdDogbnVtYmVyKSA9PiB7XG4gIHJlbmRlcihzdGFuemEsIHsuLi5odG1sUGFyYW1zLCBpc0xvYWRpbmc6IHRydWV9LCBzdGFuemFQYXJhbXMpO1xuICBjb25zdCBvZmZzZXQgPSBodG1sUGFyYW1zLm9mZnNldCArIGxpbWl0O1xuICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKHN0YW56YVBhcmFtcy5hcGlfdXJsLCBvZmZzZXQsIGxpbWl0KTtcbiAgY29uc3QgcGFyYW1zOiBIVE1MUGFyYW1zID0gcHJvY2Vzc0RhdGEoZGF0YSwgb2Zmc2V0LCBzdGFuemFQYXJhbXMpO1xuICByZW5kZXIoc3RhbnphLCBwYXJhbXMsIHN0YW56YVBhcmFtcyk7XG59O1xuXG5jb25zdCBwcm9jZXNzRGF0YSA9IChyZXNwb25zZTogQVBJUmVzcG9uc2UsIG9mZnNldDogbnVtYmVyLCBzdGFuemFQYXJhbXM6IFN0YW56YVBhcmFtcyk6IEhUTUxQYXJhbXMgPT4ge1xuICBzd2l0Y2ggKHJlc3BvbnNlLnN0YXR1cykge1xuICAgIGNhc2UgMjAwOlxuICAgICAgcmV0dXJuIG1ha2VTdWNjZXNzRGF0YShyZXNwb25zZSwgb2Zmc2V0LCBzdGFuemFQYXJhbXMpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbWFrZUZhaWxQYXJhbXMocmVzcG9uc2UsIHN0YW56YVBhcmFtcyk7XG4gIH1cbn07XG5cbmNvbnN0IG1ha2VTdWNjZXNzRGF0YSA9IChyZXNwb25zZTogQVBJUmVzcG9uc2UsIG9mZnNldDogbnVtYmVyLCBzdGFuemFQYXJhbXM6IFN0YW56YVBhcmFtcyk6IEhUTUxQYXJhbXMgPT4ge1xuICBjb25zdCBjb2x1bW5MYWJlbHM6IHN0cmluZ1tdID0gcmVzcG9uc2UuYm9keS5jb2x1bW5zLm1hcChpdGVtID0+IGl0ZW0ubGFiZWwpO1xuICBjb25zdCBrZXlzOiBzdHJpbmdbXSA9IHJlc3BvbnNlLmJvZHkuY29sdW1ucy5tYXAoaXRlbSA9PiBpdGVtLmtleSk7XG4gIGNvbnN0IG5vV3JhcHM6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuICByZXNwb25zZS5ib2R5LmNvbHVtbnMuZm9yRWFjaChpdGVtID0+IG5vV3JhcHNbaXRlbS5rZXldID0gaXRlbS5ub3dyYXApO1xuICBjb25zdCBkYXRhOiBJdGVtW11bXSA9IHJlc3BvbnNlLmJvZHkuY29udGVudHMubWFwKGl0ZW0gPT4ge1xuICAgIGNvbnN0IHJlc3VsdDogSXRlbVtdID0gW107XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IFN0cmluZ0l0ZW07XG4gICAgICBpZiAodHlwZW9mIGl0ZW1ba2V5XSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YWx1ZSA9IHtsYWJlbDogaXRlbVtrZXldIGFzIHN0cmluZ307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGl0ZW1ba2V5XSBhcyBMaW5rSXRlbTtcbiAgICAgIH1cbiAgICAgIGlmIChub1dyYXBzW2tleV0pIHtcbiAgICAgICAgdmFsdWUubm93cmFwID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcbiAgY29uc3QgdG90YWw6IG51bWJlciA9IHJlc3BvbnNlLmJvZHkudG90YWw7XG4gIGNvbnN0IF9lbmQ6IG51bWJlciA9IHBhcnNlSW50KHN0YW56YVBhcmFtcy5saW1pdCwgMTApICsgb2Zmc2V0O1xuICBjb25zdCBlbmQ6IG51bWJlciA9IF9lbmQgPD0gdG90YWwgPyBfZW5kIDogdG90YWw7XG4gIGNvbnN0IGhhc1ByZXY6IGJvb2xlYW4gPSBvZmZzZXQgIT09IDA7XG4gIGNvbnN0IGhhc05leHQ6IGJvb2xlYW4gPSBlbmQgPCB0b3RhbDtcbiAgY29uc3QgdGl0bGU6IHN0cmluZyA9IHN0YW56YVBhcmFtcy50aXRsZTtcbiAgY29uc3QgaW5mbzogc3RyaW5nID0gaGFzTmV4dCB8fCBoYXNQcmV2ID8gYHNob3dpbmcgJHtvZmZzZXQgKyAxfSB0byAke2VuZH0gb2YgdG90YWwgJHt0b3RhbH0gaXRlbXNgIDogYHRvdGFsICR7dG90YWx9IGl0ZW1zYDtcbiAgY29uc3QgX2NvbHVtbnM6IHN0cmluZyA9IHN0YW56YVBhcmFtcy5jb2x1bW5fbmFtZXM7XG4gIGNvbnN0IHNob3dDb2x1bW5OYW1lczogYm9vbGVhbiA9IF9jb2x1bW5zLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogQm9vbGVhbihzdGFuemFQYXJhbXMuY29sdW1uX25hbWVzKTtcblxuICByZXR1cm4ge1xuICAgIHRpdGxlLFxuICAgIG9mZnNldCxcbiAgICBjb2x1bW5MYWJlbHMsXG4gICAgZGF0YSxcbiAgICBoYXNOZXh0LFxuICAgIGhhc1ByZXYsXG4gICAgaW5mbyxcbiAgICBzaG93Q29sdW1uTmFtZXMsXG4gICAgc3RhdHVzOiAyMDAsXG4gICAgc3RhdHVzVGV4dDogXCJcIlxuICB9O1xufTtcblxuY29uc3QgbWFrZUZhaWxQYXJhbXMgPSAocmVzcG9uc2U6IEFQSVJlc3BvbnNlLCBzdGFuemFQYXJhbXM6IFN0YW56YVBhcmFtcyk6IEhUTUxQYXJhbXMgPT4ge1xuICByZXR1cm4ge1xuICAgIHRpdGxlOiBzdGFuemFQYXJhbXMudGl0bGUsXG4gICAgb2Zmc2V0OiAwLFxuICAgIGNvbHVtbkxhYmVsczogbnVsbCxcbiAgICBkYXRhOiBudWxsLFxuICAgIGhhc05leHQ6IGZhbHNlLFxuICAgIGhhc1ByZXY6IGZhbHNlLFxuICAgIGluZm86IG51bGwsXG4gICAgc2hvd0NvbHVtbk5hbWVzOiBmYWxzZSxcbiAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiByZXNwb25zZS5tZXNzYWdlLFxuICB9O1xuXG59O1xuXG5jb25zdCBmZXRjaERhdGEgPSBhc3luYyh1cmw6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBQcm9taXNlPEFQSVJlc3BvbnNlPiA9PiB7XG4gIC8vIHJldHVybiBmZXRjaER1bW15KHF1ZXJ5LCBvZmZzZXQsIGxpbWl0KTtcbiAgcmV0dXJuIGZldGNoTGl2ZSh1cmwsIG9mZnNldCwgbGltaXQpO1xufTtcblxuY29uc3QgZmV0Y2hMaXZlID0gYXN5bmModXJsOiBzdHJpbmcsIG9mZnNldDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogUHJvbWlzZTxBUElSZXNwb25zZT4gPT4ge1xuICBjb25zdCBbdXJpLCBxdWVyeV06IFtzdHJpbmcsIHN0cmluZ10gPSBzZXBhcmF0ZVVSTCh1cmwpO1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgbWFrZU9wdGlvbnMoe29mZnNldCwgbGltaXR9LCBxdWVyeSkpO1xuICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICBtZXNzYWdlOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgYm9keTogbnVsbFxuICAgIH07XG4gIH1cbiAgY29uc3QgYm9keTogYW55ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogMjAwLFxuICAgIGJvZHlcbiAgfTtcbn07XG5cbmNvbnN0IGZldGNoRHVtbXkgPSBhc3luYyhxdWVyeTogc3RyaW5nLCBvZmZzZXQ6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IFByb21pc2U8QVBJUmVzcG9uc2U+ID0+IHtcbiAgYXdhaXQgdGltZW91dCgxMDAwKTtcbiAgY29uc3QgdG90YWw6IG51bWJlciA9IDIyO1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogMjAwLFxuICAgIGJvZHk6IHtcbiAgICAgIHRvdGFsOiB0b3RhbCxcbiAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgY29udGVudHM6IG1ha2VDb250ZW50cyhsaW1pdCwgb2Zmc2V0LCB0b3RhbCksXG4gICAgICBjb2x1bW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6IFwiaW5kZXhcIixcbiAgICAgICAgICBsYWJlbDogXCJJTkRFWFwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiBcImdtX2lkXCIsXG4gICAgICAgICAgbGFiZWw6IFwiR00gSURcIixcbiAgICAgICAgICBub3dyYXA6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6IFwibmFtZVwiLFxuICAgICAgICAgIGxhYmVsOiBcIk5BTUVcIlxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgfTtcbn07XG5cblxuY29uc3QgbWFrZUNvbnRlbnRzID0gKGNvdW50OiBudW1iZXIsIG9mZnNldDogbnVtYmVyLCB0b3RhbDogbnVtYmVyKTogQ29udGVudFtdID0+IHtcbiAgY29uc3QgcmVzdWx0OiBDb250ZW50W10gPSBbXTtcbiAgY29uc3QgYWN0dWFsQ291bnQgPSBjb3VudCArIG9mZnNldCA8IHRvdGFsID8gY291bnQgOiB0b3RhbCAtIG9mZnNldCArIDE7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3R1YWxDb3VudDsgaSsrKSB7XG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgaW5kZXg6IChpICsgb2Zmc2V0KS50b1N0cmluZygpLFxuICAgICAgZ21faWQ6IHtcbiAgICAgICAgaHJlZjogXCIvbWVkaWEvU1k0M3FcIixcbiAgICAgICAgbGFiZWw6IFwiU1k0M2FcIlxuICAgICAgfSxcbiAgICAgIG5hbWU6IFwiQkwgQUdBUiAoR0xVQ09TRSBCTE9PRCBMSVZFUiBBR0FSKVwiXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IG1ha2VFbXB0eURhdGEgPSAocGFyYW1zOiBIVE1MUGFyYW1zKTogSFRNTFBhcmFtcyA9PiB7XG4gIHJldHVybiB7Li4ucGFyYW1zLCBkYXRhOiBbXX07XG59O1xuXG5jb25zdCB0aW1lb3V0ID0gKG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufTtcblxuY29uc3Qgc2VwYXJhdGVVUkwgPSAodXJsOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmddID0+IHtcbiAgY29uc3Qgc2VwYXJhdGVkID0gLyguKilcXD8oLiopLy5leGVjKHVybCk7XG4gIGxldCB1cmksIHF1ZXJ5O1xuICBpZiAoc2VwYXJhdGVkKSB7XG4gICAgdXJpID0gc2VwYXJhdGVkWzFdO1xuICAgIHF1ZXJ5ID0gc2VwYXJhdGVkWzJdO1xuICB9IGVsc2Uge1xuICAgIHVyaSA9IHVybDtcbiAgICBxdWVyeSA9IFwiXCI7XG4gIH1cbiAgcmV0dXJuIFt1cmksIHF1ZXJ5XTtcbn07XG5cbmNvbnN0IGZpbHRlclF1ZXJ5ID0gKHF1ZXJ5OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXG4gIC8vIGNvbnNvbGUubG9nKHF1ZXJ5KTtcbiAgbGV0IGlzT21pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBjb25zdCByZXN1bHQ6IHN0cmluZyA9IHF1ZXJ5LnNwbGl0KFwiJlwiKS5maWx0ZXIoc3RyID0+IHtcbiAgICBjb25zdCByZWcgPSAvKC4qKT0oLiopLy5leGVjKHN0cik7XG4gICAgY29uc3QgW2tleSwgdmFsdWVdOiBbc3RyaW5nLCBzdHJpbmddID0gW3JlZ1sxXSwgcmVnWzJdXTtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSBcImxpbWl0XCI6XG4gICAgICBjYXNlIFwib2Zmc2V0XCI6XG4gICAgICAgIGlzT21pdHRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSkuam9pbihcIiZcIik7XG4gIGlmIChpc09taXR0ZWQpIHtcbiAgICBjb25zb2xlLndhcm4oXCJsaW1pdCBhbmQgb2Zmc2V0IG9uIEFQSV9VUkwgaGF2ZSBiZWVuIG9taXR0ZWQgYXMgdGhleSBhcmUgc2V0IGZyb20gdGhlIFN0YW56YVwiKTtcbiAgfVxuICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG5jb25zdCBtYWtlT3B0aW9ucyA9IChwYXJhbXM6IGFueSwgcXVlcnk6IHN0cmluZyk6IFJlcXVlc3RJbml0ID0+IHtcbiAgbGV0IGZvcm1Cb2R5ID0gW107XG5cblxuICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvcm1Cb2R5LnB1c2goa2V5ICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tleV0pKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgYm9keSA9IGAke2ZpbHRlclF1ZXJ5KHF1ZXJ5KX0mJHtmb3JtQm9keS5qb2luKFwiJlwiKX1gO1xuXG4gIHJldHVybiB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBtb2RlOiBcImNvcnNcIixcbiAgICBib2R5LFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIlxuICAgIH1cbiAgfTtcbn07XG5cblxudHlwZSBJdGVtID0gU3RyaW5nSXRlbSB8IExpbmtJdGVtO1xuXG5pbnRlcmZhY2UgU3RhbnphUGFyYW1zIHtcbiAgYXBpX3VybDogc3RyaW5nO1xuICBsaW1pdDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjb2x1bW5fbmFtZXM6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEhUTUxQYXJhbXMge1xuICBjb2x1bW5MYWJlbHM6IHN0cmluZ1tdO1xuICBkYXRhOiBJdGVtW11bXTtcbiAgb2Zmc2V0OiBudW1iZXI7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGhhc05leHQ6IGJvb2xlYW47XG4gIGhhc1ByZXY6IGJvb2xlYW47XG4gIGluZm86IHN0cmluZztcbiAgc2hvd0NvbHVtbk5hbWVzOiBib29sZWFuO1xuICBpc0xvYWRpbmc/OiBib29sZWFuO1xuICBzdGF0dXM6IG51bWJlcjtcbiAgc3RhdHVzVGV4dDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQVBJUmVzcG9uc2Uge1xuICBzdGF0dXM6IG51bWJlcjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgYm9keToge1xuICAgIHRvdGFsOiBudW1iZXI7XG4gICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgY29udGVudHM6IENvbnRlbnRbXTtcbiAgICBjb2x1bW5zOiBDb2x1bW5bXTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIENvbnRlbnQge1xuICBba2V5OiBzdHJpbmddOiAoTGlua0l0ZW0gfCBzdHJpbmcpO1xufVxuXG5pbnRlcmZhY2UgTGlua0l0ZW0ge1xuICBocmVmOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIG5vd3JhcD86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTdHJpbmdJdGVtIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgbm93cmFwPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIENvbHVtbiB7XG4gIGtleTogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBub3dyYXA/OiBib29sZWFuO1xufVxuXG5cbiJdLCJzb3VyY2VSb290IjoiIn0=