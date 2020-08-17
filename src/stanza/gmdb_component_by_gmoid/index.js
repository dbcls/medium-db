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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/stanza/gmdb_component_by_gmoid/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/stanza/gmdb_component_by_gmoid/index.ts":
/*!*****************************************************!*\
  !*** ./src/stanza/gmdb_component_by_gmoid/index.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../typescript/utils */ "./src/stanza/typescript/utils.ts");
const api_name = "gmdb_component_by_gmoid";
Stanza(async (stanza, params) => {
    const renderParams = {
        result: null,
        msg: null,
        error: false,
    };
    if (!params["gmo_id"]) {
        renderParams.error = true;
        renderParams.msg = "gmo_id (e.g. GMO_001010) is required";
    }
    try {
        const data = await utils_1.getData(api_name, params);
        if (!data.pref_label) {
            const gmoID = params["gmo_id"];
            renderParams.error = true;
            renderParams.msg = `Not found. gmo_id: ${gmoID}`;
        }
        else {
            renderParams.result = parseData(data);
        }
    }
    catch (e) {
        renderParams.error = true;
        renderParams.msg = `Server Error: ${e}`;
    }
    stanza.render({
        template: "stanza.html",
        parameters: renderParams
    });
});
function parseData(json) {
    const data = {};
    data.alt_labels_en = [];
    data.alt_labels_ja = [];
    data.super_classes = [];
    data.sub_classes = [];
    data.links = [];
    data.properties = [];
    data.roles = [];
    const host = location.host;
    data.gmo_id = json.id;
    data.pref_label = json.pref_label;
    data.json_label_ja = json.label_ja;
    if (json.alt_labels_en) {
        data.alt_labels_en = json.alt_labels_en.map((str) => ({ value: str }));
    }
    if (json.super_classes) {
        data.super_classes = json.super_classes.map((obj) => ({
            gmo_id: obj.gmo_id,
            uri: obj.uri,
            label_en: obj.label_en
        }));
    }
    if (json.sub_classes) {
        data.sub_classes = json.sub_classes.map((obj) => ({
            gmo_id: obj.gmo_id,
            uri: obj.uri,
            label_en: obj.label_en
        }));
    }
    if (json.links) {
        data.links = json.links.map((str) => ({
            label: getLinkLabel(str),
            url: str,
        })).filter((obj) => !!obj.label);
    }
    if (json.properties) {
        data.properties = json.properties.map((obj) => {
            obj.host = host;
            return obj;
        });
    }
    if (json.roles) {
        data.roles = json.roles.map((obj) => obj);
    }
    return data;
}
const getLinkLabel = (link) => {
    switch (true) {
        case /pccompound/.test(link):
            return "PubChem";
        case /wikipedia/.test(link):
            return "Wikipedia";
        case /ncicb/.test(link):
            return "NCI Thesaurus";
        case /CHEBI/.test(link):
            return "ChEBI";
        case /SNOMEDCT/.test(link):
            return "SNOMED-CT";
        default:
            return "";
    }
};


/***/ }),

/***/ "./src/stanza/typescript/consts.ts":
/*!*****************************************!*\
  !*** ./src/stanza/typescript/consts.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.api_url = "http://ep.dbcls.jp/sparqlist/api/";


/***/ }),

/***/ "./src/stanza/typescript/utils.ts":
/*!****************************************!*\
  !*** ./src/stanza/typescript/utils.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(/*! ./consts */ "./src/stanza/typescript/consts.ts");
exports.makeOptions = (params) => {
    let formBody = [];
    for (let key in params) {
        if (params[key]) {
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
exports.getData = async (path, params) => {
    const options = exports.makeOptions(params);
    const res = await fetch(`${consts_1.api_url}${path}`, options);
    return await res.json();
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX2NvbXBvbmVudF9ieV9nbW9pZC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhbnphL3R5cGVzY3JpcHQvY29uc3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9zdGFuemEvdHlwZXNjcmlwdC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsbUdBQTRDO0FBRTVDLE1BQU0sUUFBUSxHQUFHLHlCQUF5QixDQUFDO0FBOEIzQyxNQUFNLENBQWtCLEtBQUssRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDOUMsTUFBTSxZQUFZLEdBQXVCO1FBQ3ZDLE1BQU0sRUFBRSxJQUFJO1FBQ1osR0FBRyxFQUFFLElBQUk7UUFDVCxLQUFLLEVBQUUs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IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3N0YW56YS9nbWRiX2NvbXBvbmVudF9ieV9nbW9pZC9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7Z2V0RGF0YX0gZnJvbSBcIi4uL3R5cGVzY3JpcHQvdXRpbHNcIjtcblxuY29uc3QgYXBpX25hbWUgPSBcImdtZGJfY29tcG9uZW50X2J5X2dtb2lkXCI7XG5cbmludGVyZmFjZSBTdGFuemFIdG1sUGFyYW0ge1xuICBnbW9faWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFN0YW56YVJlbmRlclBhcmFtcyB7XG4gIHJlc3VsdDogYW55O1xuICBtc2c6IHN0cmluZztcbiAgZXJyb3I6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBBUElSZXN1bHQge1xuICBwcmVmX2xhYmVsOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsX2phOiBzdHJpbmc7XG4gIGFsdF9sYWJlbHNfZW46IHN0cmluZ1tdO1xuICBzdXBlcl9jbGFzc2VzOiBHbW9DbGFzc1tdO1xuICBzdWJfY2xhc3NlczogR21vQ2xhc3NbXTtcbiAgcHJvcGVydGllczogR21vQ2xhc3NbXTtcbiAgcm9sZXM6IEdtb0NsYXNzW107XG4gIGxpbmtzOiBzdHJpbmdbXTtcbn1cblxuaW50ZXJmYWNlIEdtb0NsYXNzIHtcbiAgZ21vX2lkOiBzdHJpbmc7XG4gIHVyaTogc3RyaW5nO1xuICBsYWJlbF9lbjogc3RyaW5nO1xufVxuXG5TdGFuemE8U3RhbnphSHRtbFBhcmFtPihhc3luYyhzdGFuemEsIHBhcmFtcykgPT4ge1xuICBjb25zdCByZW5kZXJQYXJhbXM6IFN0YW56YVJlbmRlclBhcmFtcyA9IHtcbiAgICByZXN1bHQ6IG51bGwsXG4gICAgbXNnOiBudWxsLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgfTtcblxuICBpZiAoIXBhcmFtc1tcImdtb19pZFwiXSkge1xuICAgIHJlbmRlclBhcmFtcy5lcnJvciA9IHRydWU7XG4gICAgcmVuZGVyUGFyYW1zLm1zZyA9IFwiZ21vX2lkIChlLmcuIEdNT18wMDEwMTApIGlzIHJlcXVpcmVkXCI7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXREYXRhPEFQSVJlc3VsdD4oYXBpX25hbWUsIHBhcmFtcyk7XG4gICAgaWYgKCFkYXRhLnByZWZfbGFiZWwpIHtcbiAgICAgIGNvbnN0IGdtb0lEID0gcGFyYW1zW1wiZ21vX2lkXCJdO1xuICAgICAgcmVuZGVyUGFyYW1zLmVycm9yID0gdHJ1ZTtcbiAgICAgIHJlbmRlclBhcmFtcy5tc2cgPSBgTm90IGZvdW5kLiBnbW9faWQ6ICR7Z21vSUR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVuZGVyUGFyYW1zLnJlc3VsdCA9IHBhcnNlRGF0YShkYXRhKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZW5kZXJQYXJhbXMuZXJyb3IgPSB0cnVlO1xuICAgIHJlbmRlclBhcmFtcy5tc2cgPSBgU2VydmVyIEVycm9yOiAke2V9YDtcbiAgfVxuXG4gIHN0YW56YS5yZW5kZXIoe1xuICAgIHRlbXBsYXRlOiBcInN0YW56YS5odG1sXCIsXG4gICAgcGFyYW1ldGVyczogcmVuZGVyUGFyYW1zXG4gIH0pO1xufSk7XG5cblxuZnVuY3Rpb24gcGFyc2VEYXRhKGpzb246IEFQSVJlc3VsdCk6IGFueSB7XG4gIGNvbnN0IGRhdGE6IGFueSA9IHt9O1xuICBkYXRhLmFsdF9sYWJlbHNfZW4gPSBbXTtcbiAgZGF0YS5hbHRfbGFiZWxzX2phID0gW107XG4gIGRhdGEuc3VwZXJfY2xhc3NlcyA9IFtdO1xuICBkYXRhLnN1Yl9jbGFzc2VzID0gW107XG4gIGRhdGEubGlua3MgPSBbXTtcbiAgZGF0YS5wcm9wZXJ0aWVzID0gW107XG4gIGRhdGEucm9sZXMgPSBbXTtcbiAgY29uc3QgaG9zdCA9IGxvY2F0aW9uLmhvc3Q7XG5cblxuICBkYXRhLmdtb19pZCA9IGpzb24uaWQ7XG4gIGRhdGEucHJlZl9sYWJlbCA9IGpzb24ucHJlZl9sYWJlbDtcbiAgZGF0YS5qc29uX2xhYmVsX2phID0ganNvbi5sYWJlbF9qYTtcblxuICBpZiAoanNvbi5hbHRfbGFiZWxzX2VuKSB7XG4gICAgZGF0YS5hbHRfbGFiZWxzX2VuID0ganNvbi5hbHRfbGFiZWxzX2VuLm1hcCgoc3RyOiBzdHJpbmcpID0+ICh7dmFsdWU6IHN0cn0pKTtcbiAgfVxuXG4gIGlmIChqc29uLnN1cGVyX2NsYXNzZXMpIHtcbiAgICBkYXRhLnN1cGVyX2NsYXNzZXMgPSBqc29uLnN1cGVyX2NsYXNzZXMubWFwKChvYmo6IGFueSkgPT4gKHtcbiAgICAgIGdtb19pZDogb2JqLmdtb19pZCxcbiAgICAgIHVyaTogb2JqLnVyaSxcbiAgICAgIGxhYmVsX2VuOiBvYmoubGFiZWxfZW5cbiAgICB9KSk7XG4gIH1cblxuICBpZiAoanNvbi5zdWJfY2xhc3Nlcykge1xuICAgIGRhdGEuc3ViX2NsYXNzZXMgPSBqc29uLnN1Yl9jbGFzc2VzLm1hcCgob2JqOiBHbW9DbGFzcykgPT4gKHtcbiAgICAgIGdtb19pZDogb2JqLmdtb19pZCxcbiAgICAgIHVyaTogb2JqLnVyaSxcbiAgICAgIGxhYmVsX2VuOiBvYmoubGFiZWxfZW5cbiAgICB9KSk7XG4gIH1cblxuICBpZiAoanNvbi5saW5rcykge1xuICAgIGRhdGEubGlua3MgPSBqc29uLmxpbmtzLm1hcCgoc3RyOiBzdHJpbmcpID0+ICh7XG4gICAgICBsYWJlbDogZ2V0TGlua0xhYmVsKHN0ciksXG4gICAgICB1cmw6IHN0cixcbiAgICB9KSkuZmlsdGVyKChvYmo6IGFueSkgPT4gISFvYmoubGFiZWwpO1xuICB9XG5cbiAgaWYgKGpzb24ucHJvcGVydGllcykge1xuICAgIGRhdGEucHJvcGVydGllcyA9IGpzb24ucHJvcGVydGllcy5tYXAoKG9iajogYW55KSA9PiB7XG4gICAgICBvYmouaG9zdCA9IGhvc3Q7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuXG4gIH1cblxuICBpZiAoanNvbi5yb2xlcykge1xuICAgIGRhdGEucm9sZXMgPSBqc29uLnJvbGVzLm1hcCgob2JqOiBhbnkpID0+IG9iaik7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxuXG5jb25zdCBnZXRMaW5rTGFiZWwgPSAobGluazogc3RyaW5nKSA9PiB7XG4gIHN3aXRjaCAodHJ1ZSkge1xuICAgIGNhc2UgL3BjY29tcG91bmQvLnRlc3QobGluayk6XG4gICAgICByZXR1cm4gXCJQdWJDaGVtXCI7XG4gICAgY2FzZSAvd2lraXBlZGlhLy50ZXN0KGxpbmspOlxuICAgICAgcmV0dXJuIFwiV2lraXBlZGlhXCI7XG4gICAgY2FzZSAvbmNpY2IvLnRlc3QobGluayk6XG4gICAgICByZXR1cm4gXCJOQ0kgVGhlc2F1cnVzXCI7XG4gICAgY2FzZSAvQ0hFQkkvLnRlc3QobGluayk6XG4gICAgICByZXR1cm4gXCJDaEVCSVwiO1xuICAgIGNhc2UgL1NOT01FRENULy50ZXN0KGxpbmspOlxuICAgICAgcmV0dXJuIFwiU05PTUVELUNUXCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBcIlwiO1xuICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGFwaV91cmwgPSBcImh0dHA6Ly9lcC5kYmNscy5qcC9zcGFycWxpc3QvYXBpL1wiO1xuIiwiaW1wb3J0IHthcGlfdXJsfSBmcm9tIFwiLi9jb25zdHNcIjtcblxuZXhwb3J0IGNvbnN0IG1ha2VPcHRpb25zID0gKHBhcmFtczogYW55KTogUmVxdWVzdEluaXQgPT4ge1xuICBsZXQgZm9ybUJvZHkgPSBbXTtcblxuICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtc1trZXldKSB7XG4gICAgICBmb3JtQm9keS5wdXNoKGtleSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBtb2RlOiBcImNvcnNcIiBhcyBSZXF1ZXN0TW9kZSxcbiAgICBib2R5OiBmb3JtQm9keS5qb2luKFwiJlwiKSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGF0YSA9IGFzeW5jPFQ+KHBhdGg6IHN0cmluZywgcGFyYW1zOiBhbnkpOiBQcm9taXNlPFQ+ID0+IHtcbiAgY29uc3Qgb3B0aW9ucyA9IG1ha2VPcHRpb25zKHBhcmFtcyk7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2FwaV91cmx9JHtwYXRofWAsIG9wdGlvbnMpO1xuICByZXR1cm4gYXdhaXQgcmVzLmpzb24oKTtcbn07XG5cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==