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
    console.log(url);
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
    if (!query) {
        return "";
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsTUFBTSxDQUFlLEtBQUssV0FBVSxNQUFNLEVBQUUsWUFBWTtJQUN0RCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RixNQUFNLFNBQVMsR0FBZSxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN0RSxNQUFNLENBQUMsTUFBTSxFQUFFLFNB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QUFDaEIsQ0FBQyxDQUFDO0FBR0YsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFXLEVBQUUsS0FBYSxFQUFlLEVBQUU7SUFDOUQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBR2xCLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO1FBQ3RCLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUM3QixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RDtLQUNGO0lBQ0QsTUFBTSxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBRTNELE9BQU87UUFDTCxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSTtRQUNKLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsY0FBYyxFQUFFLG1DQUFtQztTQUNwRDtLQUNGLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixJQUFLLFNBR0o7QUFIRCxXQUFLLFNBQVM7SUFDWix5Q0FBUTtJQUNSLDBDQUFTO0FBQ1gsQ0FBQyxFQUhJLFNBQVMsS0FBVCxTQUFTLFFBR2IiLCJmaWxlIjoiZ21kYl9tZXRhX2xpc3QvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9zdGFuemEvZ21kYl9tZXRhX2xpc3QvaW5kZXgudHNcIik7XG4iLCJTdGFuemE8U3RhbnphUGFyYW1zPihhc3luYyBmdW5jdGlvbihzdGFuemEsIHN0YW56YVBhcmFtcykge1xuICBjb25zdCBvZmZzZXQ6IG51bWJlciA9IDA7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaERhdGEoc3RhbnphUGFyYW1zLmFwaV91cmwsIG9mZnNldCwgcGFyc2VJbnQoc3RhbnphUGFyYW1zLmxpbWl0LCAxMCkpO1xuICBjb25zdCBodG1sUHJhbXM6IEhUTUxQYXJhbXMgPSBwcm9jZXNzRGF0YShkYXRhLCBvZmZzZXQsIHN0YW56YVBhcmFtcyk7XG4gIHJlbmRlcihzdGFuemEsIGh0bWxQcmFtcywgc3RhbnphUGFyYW1zKTtcbn0pO1xuXG5cbmNvbnN0IHJlbmRlciA9IChzdGFuemE6IFN0YW56YUluc3RhbmNlLCBodG1sUGFyYW1zOiBIVE1MUGFyYW1zLCBzdGFuemFQYXJhbXM6IFN0YW56YVBhcmFtcykgPT4ge1xuICBjb25zdCBsaW1pdDogbnVtYmVyID0gcGFyc2VJbnQoc3RhbnphUGFyYW1zLmxpbWl0LCAxMCk7XG4gIHN0YW56YS5yZW5kZXIoe1xuICAgIHRlbXBsYXRlOiBcInN0YW56YS5odG1sXCIsXG4gICAgcGFyYW1ldGVyczogaHRtbFBhcmFtc1xuICB9KTtcbiAgc3RhbnphLnNlbGVjdChcIiNidG5QcmV2XCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMoKSA9PiB7XG4gICAgYXdhaXQgbW92ZVBhZ2Uoc3RhbnphLCBodG1sUGFyYW1zLCBzdGFuemFQYXJhbXMsIGxpbWl0LCBESVJFQ1RJT04uUFJFVik7XG4gIH0pO1xuICBzdGFuemEuc2VsZWN0KFwiI2J0bk5leHRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYygpID0+IHtcbiAgICBhd2FpdCBtb3ZlUGFnZShzdGFuemEsIGh0bWxQYXJhbXMsIHN0YW56YVBhcmFtcywgbGltaXQsIERJUkVDVElPTi5ORVhUKTtcbiAgfSk7XG59O1xuXG5jb25zdCBtb3ZlUGFnZSA9IGFzeW5jKHN0YW56YTogU3RhbnphSW5zdGFuY2UsIGh0bWxQYXJhbXM6IEhUTUxQYXJhbXMsIHN0YW56YVBhcmFtczogU3RhbnphUGFyYW1zLCBsaW1pdDogbnVtYmVyLCBkaXJlY3Rpb246IERJUkVDVElPTikgPT4ge1xuICByZW5kZXIoc3RhbnphLCB7Li4uaHRtbFBhcmFtcywgaXNMb2FkaW5nOiB0cnVlfSwgc3RhbnphUGFyYW1zKTtcbiAgY29uc3Qgb2Zmc2V0ID0gaHRtbFBhcmFtcy5vZmZzZXQgKyBsaW1pdCAqIGRpcmVjdGlvbjtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShzdGFuemFQYXJhbXMuYXBpX3VybCwgb2Zmc2V0LCBsaW1pdCk7XG4gIGNvbnN0IHBhcmFtczogSFRNTFBhcmFtcyA9IHByb2Nlc3NEYXRhKGRhdGEsIG9mZnNldCwgc3RhbnphUGFyYW1zKTtcbiAgcmVuZGVyKHN0YW56YSwgcGFyYW1zLCBzdGFuemFQYXJhbXMpO1xufTtcblxuY29uc3QgcHJvY2Vzc0RhdGEgPSAocmVzcG9uc2U6IEFQSVJlc3BvbnNlLCBvZmZzZXQ6IG51bWJlciwgc3RhbnphUGFyYW1zOiBTdGFuemFQYXJhbXMpOiBIVE1MUGFyYW1zID0+IHtcbiAgc3dpdGNoIChyZXNwb25zZS5zdGF0dXMpIHtcbiAgICBjYXNlIDIwMDpcbiAgICAgIHJldHVybiBtYWtlU3VjY2Vzc0RhdGEocmVzcG9uc2UsIG9mZnNldCwgc3RhbnphUGFyYW1zKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1ha2VGYWlsUGFyYW1zKHJlc3BvbnNlLCBzdGFuemFQYXJhbXMpO1xuICB9XG59O1xuXG5jb25zdCBtYWtlU3VjY2Vzc0RhdGEgPSAocmVzcG9uc2U6IEFQSVJlc3BvbnNlLCBvZmZzZXQ6IG51bWJlciwgc3RhbnphUGFyYW1zOiBTdGFuemFQYXJhbXMpOiBIVE1MUGFyYW1zID0+IHtcbiAgY29uc3QgY29sdW1uTGFiZWxzOiBzdHJpbmdbXSA9IHJlc3BvbnNlLmJvZHkuY29sdW1ucy5tYXAoaXRlbSA9PiBpdGVtLmxhYmVsKTtcbiAgY29uc3Qga2V5czogc3RyaW5nW10gPSByZXNwb25zZS5ib2R5LmNvbHVtbnMubWFwKGl0ZW0gPT4gaXRlbS5rZXkpO1xuICBjb25zdCBub1dyYXBzOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgcmVzcG9uc2UuYm9keS5jb2x1bW5zLmZvckVhY2goaXRlbSA9PiBub1dyYXBzW2l0ZW0ua2V5XSA9IGl0ZW0ubm93cmFwKTtcbiAgY29uc3QgZGF0YTogSXRlbVtdW10gPSByZXNwb25zZS5ib2R5LmNvbnRlbnRzLm1hcChpdGVtID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IEl0ZW1bXSA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBTdHJpbmdJdGVtO1xuICAgICAgaWYgKHR5cGVvZiBpdGVtW2tleV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFsdWUgPSB7bGFiZWw6IGl0ZW1ba2V5XSBhcyBzdHJpbmd9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBpdGVtW2tleV0gYXMgTGlua0l0ZW07XG4gICAgICB9XG4gICAgICBpZiAobm9XcmFwc1trZXldKSB7XG4gICAgICAgIHZhbHVlLm5vd3JhcCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG4gIGNvbnN0IHRvdGFsOiBudW1iZXIgPSByZXNwb25zZS5ib2R5LnRvdGFsO1xuICBjb25zdCBfZW5kOiBudW1iZXIgPSBwYXJzZUludChzdGFuemFQYXJhbXMubGltaXQsIDEwKSArIG9mZnNldDtcbiAgY29uc3QgZW5kOiBudW1iZXIgPSBfZW5kIDw9IHRvdGFsID8gX2VuZCA6IHRvdGFsO1xuICBjb25zdCBoYXNQcmV2OiBib29sZWFuID0gb2Zmc2V0ICE9PSAwO1xuICBjb25zdCBoYXNOZXh0OiBib29sZWFuID0gZW5kIDwgdG90YWw7XG4gIGNvbnN0IHRpdGxlOiBzdHJpbmcgPSBzdGFuemFQYXJhbXMudGl0bGU7XG4gIGNvbnN0IGluZm86IHN0cmluZyA9IGhhc05leHQgfHwgaGFzUHJldiA/IGBzaG93aW5nICR7b2Zmc2V0ICsgMX0gdG8gJHtlbmR9IG9mIHRvdGFsICR7dG90YWx9IGl0ZW1zYCA6IGB0b3RhbCAke3RvdGFsfSBpdGVtc2A7XG4gIGNvbnN0IF9jb2x1bW5zOiBzdHJpbmcgPSBzdGFuemFQYXJhbXMuY29sdW1uX25hbWVzO1xuICBjb25zdCBzaG93Q29sdW1uTmFtZXM6IGJvb2xlYW4gPSBfY29sdW1ucy50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIgPyBmYWxzZSA6IEJvb2xlYW4oc3RhbnphUGFyYW1zLmNvbHVtbl9uYW1lcyk7XG5cbiAgcmV0dXJuIHtcbiAgICB0aXRsZSxcbiAgICBvZmZzZXQsXG4gICAgY29sdW1uTGFiZWxzLFxuICAgIGRhdGEsXG4gICAgaGFzTmV4dCxcbiAgICBoYXNQcmV2LFxuICAgIGluZm8sXG4gICAgc2hvd0NvbHVtbk5hbWVzLFxuICAgIHN0YXR1czogMjAwLFxuICAgIHN0YXR1c1RleHQ6IFwiXCJcbiAgfTtcbn07XG5cbmNvbnN0IG1ha2VGYWlsUGFyYW1zID0gKHJlc3BvbnNlOiBBUElSZXNwb25zZSwgc3RhbnphUGFyYW1zOiBTdGFuemFQYXJhbXMpOiBIVE1MUGFyYW1zID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0aXRsZTogc3RhbnphUGFyYW1zLnRpdGxlLFxuICAgIG9mZnNldDogMCxcbiAgICBjb2x1bW5MYWJlbHM6IG51bGwsXG4gICAgZGF0YTogbnVsbCxcbiAgICBoYXNOZXh0OiBmYWxzZSxcbiAgICBoYXNQcmV2OiBmYWxzZSxcbiAgICBpbmZvOiBudWxsLFxuICAgIHNob3dDb2x1bW5OYW1lczogZmFsc2UsXG4gICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogcmVzcG9uc2UubWVzc2FnZSxcbiAgfTtcblxufTtcblxuY29uc3QgZmV0Y2hEYXRhID0gYXN5bmModXJsOiBzdHJpbmcsIG9mZnNldDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogUHJvbWlzZTxBUElSZXNwb25zZT4gPT4ge1xuICAvLyByZXR1cm4gZmV0Y2hEdW1teShxdWVyeSwgb2Zmc2V0LCBsaW1pdCk7XG4gIHJldHVybiBmZXRjaExpdmUodXJsLCBvZmZzZXQsIGxpbWl0KTtcbn07XG5cbmNvbnN0IGZldGNoTGl2ZSA9IGFzeW5jKHVybDogc3RyaW5nLCBvZmZzZXQ6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IFByb21pc2U8QVBJUmVzcG9uc2U+ID0+IHtcbiAgY29uc3QgW3VyaSwgcXVlcnldOiBbc3RyaW5nLCBzdHJpbmddID0gc2VwYXJhdGVVUkwodXJsKTtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG1ha2VPcHRpb25zKHtvZmZzZXQsIGxpbWl0fSwgcXVlcnkpKTtcbiAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgbWVzc2FnZTogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgIGJvZHk6IG51bGxcbiAgICB9O1xuICB9XG4gIGNvbnN0IGJvZHk6IGFueSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHtcbiAgICBzdGF0dXM6IDIwMCxcbiAgICBib2R5XG4gIH07XG59O1xuXG5jb25zdCBmZXRjaER1bW15ID0gYXN5bmMocXVlcnk6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBQcm9taXNlPEFQSVJlc3BvbnNlPiA9PiB7XG4gIGF3YWl0IHRpbWVvdXQoMTAwMCk7XG4gIGNvbnN0IHRvdGFsOiBudW1iZXIgPSAyMjtcbiAgcmV0dXJuIHtcbiAgICBzdGF0dXM6IDIwMCxcbiAgICBib2R5OiB7XG4gICAgICB0b3RhbDogdG90YWwsXG4gICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgIGNvbnRlbnRzOiBtYWtlQ29udGVudHMobGltaXQsIG9mZnNldCwgdG90YWwpLFxuICAgICAgY29sdW1uczogW1xuICAgICAgICB7XG4gICAgICAgICAga2V5OiBcImluZGV4XCIsXG4gICAgICAgICAgbGFiZWw6IFwiSU5ERVhcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogXCJnbV9pZFwiLFxuICAgICAgICAgIGxhYmVsOiBcIkdNIElEXCIsXG4gICAgICAgICAgbm93cmFwOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiBcIm5hbWVcIixcbiAgICAgICAgICBsYWJlbDogXCJOQU1FXCJcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIH07XG59O1xuXG5cbmNvbnN0IG1ha2VDb250ZW50cyA9IChjb3VudDogbnVtYmVyLCBvZmZzZXQ6IG51bWJlciwgdG90YWw6IG51bWJlcik6IENvbnRlbnRbXSA9PiB7XG4gIGNvbnN0IHJlc3VsdDogQ29udGVudFtdID0gW107XG4gIGNvbnN0IGFjdHVhbENvdW50ID0gY291bnQgKyBvZmZzZXQgPCB0b3RhbCA/IGNvdW50IDogdG90YWwgLSBvZmZzZXQgKyAxO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0dWFsQ291bnQ7IGkrKykge1xuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIGluZGV4OiAoaSArIG9mZnNldCkudG9TdHJpbmcoKSxcbiAgICAgIGdtX2lkOiB7XG4gICAgICAgIGhyZWY6IFwiL21lZGlhL1NZNDNxXCIsXG4gICAgICAgIGxhYmVsOiBcIlNZNDNhXCJcbiAgICAgIH0sXG4gICAgICBuYW1lOiBcIkJMIEFHQVIgKEdMVUNPU0UgQkxPT0QgTElWRVIgQUdBUilcIlxuICAgIH0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jb25zdCBtYWtlRW1wdHlEYXRhID0gKHBhcmFtczogSFRNTFBhcmFtcyk6IEhUTUxQYXJhbXMgPT4ge1xuICByZXR1cm4gey4uLnBhcmFtcywgZGF0YTogW119O1xufTtcblxuY29uc3QgdGltZW91dCA9IChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn07XG5cbmNvbnN0IHNlcGFyYXRlVVJMID0gKHVybDogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nXSA9PiB7XG4gIGNvbnNvbGUubG9nKHVybCk7XG4gIGNvbnN0IHNlcGFyYXRlZCA9IC8oLiopXFw/KC4qKS8uZXhlYyh1cmwpO1xuICBsZXQgdXJpLCBxdWVyeTtcbiAgaWYgKHNlcGFyYXRlZCkge1xuICAgIHVyaSA9IHNlcGFyYXRlZFsxXTtcbiAgICBxdWVyeSA9IHNlcGFyYXRlZFsyXTtcbiAgfSBlbHNlIHtcbiAgICB1cmkgPSB1cmw7XG4gICAgcXVlcnkgPSBcIlwiO1xuICB9XG4gIHJldHVybiBbdXJpLCBxdWVyeV07XG59O1xuXG5jb25zdCBmaWx0ZXJRdWVyeSA9IChxdWVyeTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFxdWVyeSkgeyByZXR1cm4gXCJcIjsgfVxuICAvLyBjb25zb2xlLmxvZyhxdWVyeSk7XG4gIGxldCBpc09taXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29uc3QgcmVzdWx0OiBzdHJpbmcgPSBxdWVyeS5zcGxpdChcIiZcIikuZmlsdGVyKHN0ciA9PiB7XG4gICAgY29uc3QgcmVnID0gLyguKik9KC4qKS8uZXhlYyhzdHIpO1xuICAgIGNvbnN0IFtrZXksIHZhbHVlXTogW3N0cmluZywgc3RyaW5nXSA9IFtyZWdbMV0sIHJlZ1syXV07XG4gICAgc3dpdGNoIChrZXkpIHtcbiAgICAgIGNhc2UgXCJsaW1pdFwiOlxuICAgICAgY2FzZSBcIm9mZnNldFwiOlxuICAgICAgICBpc09taXR0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pLmpvaW4oXCImXCIpO1xuICBpZiAoaXNPbWl0dGVkKSB7XG4gICAgY29uc29sZS53YXJuKFwibGltaXQgYW5kIG9mZnNldCBvbiBBUElfVVJMIGhhdmUgYmVlbiBvbWl0dGVkIGFzIHRoZXkgYXJlIHNldCBmcm9tIHRoZSBTdGFuemFcIik7XG4gIH1cbiAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuY29uc3QgbWFrZU9wdGlvbnMgPSAocGFyYW1zOiBhbnksIHF1ZXJ5OiBzdHJpbmcpOiBSZXF1ZXN0SW5pdCA9PiB7XG4gIGxldCBmb3JtQm9keSA9IFtdO1xuXG5cbiAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgIGlmIChwYXJhbXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3JtQm9keS5wdXNoKGtleSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trZXldKSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGJvZHkgPSBgJHtmaWx0ZXJRdWVyeShxdWVyeSl9JiR7Zm9ybUJvZHkuam9pbihcIiZcIil9YDtcblxuICByZXR1cm4ge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgbW9kZTogXCJjb3JzXCIsXG4gICAgYm9keSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcbiAgICB9XG4gIH07XG59O1xuXG5lbnVtIERJUkVDVElPTiB7XG4gIE5FWFQgPSAxLFxuICBQUkVWID0gLTFcbn1cblxuXG50eXBlIEl0ZW0gPSBTdHJpbmdJdGVtIHwgTGlua0l0ZW07XG5cbmludGVyZmFjZSBTdGFuemFQYXJhbXMge1xuICBhcGlfdXJsOiBzdHJpbmc7XG4gIGxpbWl0OiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGNvbHVtbl9uYW1lczogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSFRNTFBhcmFtcyB7XG4gIGNvbHVtbkxhYmVsczogc3RyaW5nW107XG4gIGRhdGE6IEl0ZW1bXVtdO1xuICBvZmZzZXQ6IG51bWJlcjtcbiAgdGl0bGU6IHN0cmluZztcbiAgaGFzTmV4dDogYm9vbGVhbjtcbiAgaGFzUHJldjogYm9vbGVhbjtcbiAgaW5mbzogc3RyaW5nO1xuICBzaG93Q29sdW1uTmFtZXM6IGJvb2xlYW47XG4gIGlzTG9hZGluZz86IGJvb2xlYW47XG4gIHN0YXR1czogbnVtYmVyO1xuICBzdGF0dXNUZXh0OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBBUElSZXNwb25zZSB7XG4gIHN0YXR1czogbnVtYmVyO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBib2R5OiB7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICBjb250ZW50czogQ29udGVudFtdO1xuICAgIGNvbHVtbnM6IENvbHVtbltdO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgQ29udGVudCB7XG4gIFtrZXk6IHN0cmluZ106IChMaW5rSXRlbSB8IHN0cmluZyk7XG59XG5cbmludGVyZmFjZSBMaW5rSXRlbSB7XG4gIGhyZWY6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgbm93cmFwPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFN0cmluZ0l0ZW0ge1xuICBsYWJlbDogc3RyaW5nO1xuICBub3dyYXA/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgQ29sdW1uIHtcbiAga2V5OiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIG5vd3JhcD86IGJvb2xlYW47XG59XG5cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==