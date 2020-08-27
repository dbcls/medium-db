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

Stanza(function (stanza, params) {
    render(stanza, processData(myData, 1));
});
const render = (stanza, params) => {
    stanza.render({
        template: "stanza.html",
        parameters: params
    });
    stanza.select("#myBtn").addEventListener("click", () => {
        const data = processData(myData, params.page + 1);
        render(stanza, data);
    });
};
const processData = (response, page) => {
    const columnLabels = response.columns.map(item => item.label);
    const keys = response.columns.map(item => item.key);
    const data = response.contents.map(item => {
        const result = [];
        keys.forEach(key => {
            const value = item[key];
            result.push(value);
        });
        return result;
    });
    return {
        page: page,
        columnLabels,
        data: data
    };
};
const myData = {
    total: 9999,
    offset: 1,
    contents: [
        {
            gm_id: {
                href: "/media/SY37/",
                label: "SY37"
            },
            name: "BHI w/ heat-inactivated Fetal Bovine Serum and Glucose"
        },
        {
            gm_id: {
                href: "/media/SY43q",
                label: "SY43a"
            },
            name: "BL AGAR (GLUCOSE BLOOD LIVER AGAR)"
        }
    ],
    columns: [
        {
            key: "gm_id",
            label: "GM ID"
        },
        {
            key: "name",
            label: "NAME"
        },
    ]
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YW56YS9nbWRiX21ldGFfbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNwRUEsTUFBTSxDQUFrQixVQUFTLE1BQU0sRUFBRSxNQUFNO0lBQzdDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBR0gsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFzQixFQUFFLE1BQWtCLEVBQUUsRUFBRTtJQUM1RCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ1osUUFBUSxFQUFFLGFBQWE7UUFDdkIsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFxQixFQUFFLElBQVksRUFBYyxFQUFFO0lBQ3RFLE1BQU0sWUFBWSxHQUFhLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sSUFBSSxHQUFhLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlELE1BQU0sSUFBSSxHQUFhLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2xELE1BQU0sTUFBTSxHQUFXLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPO1FBQ0wsSUFBSSxFQUFFLElBQUk7UUFDVixZQUFZO1FBQ1osSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQWdCO0lBQzFCLEtBQUssRUFBRSxJQUFJO0lBQ1gsTUFBTSxFQUFFLENBQUM7SUFDVCxRQUFRLEVBQUU7UUFDUjtZQUNFLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsY0FBYztnQkFDcEIsS0FBSyxFQUFFLE1BQU07YUFDZDtZQUNELElBQUksRUFBRSx3REFBd0Q7U0FDL0Q7UUFDRDtZQUNFLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsY0FBYztnQkFDcEIsS0FBSyxFQUFFLE9BQU87YUFDZjtZQUNELElBQUksRUFBRSxvQ0FBb0M7U0FDM0M7S0FDRjtJQUNELE9BQU8sRUFBRTtRQUNQO1lBQ0UsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUUsT0FBTztTQUNmO1FBQ0Q7WUFDRSxHQUFHLEVBQUUsTUFBTTtZQUNYLEtBQUssRUFBRSxNQUFNO1NBQ2Q7S0FDRjtDQUNGLENBQUMiLCJmaWxlIjoiZ21kYl9tZXRhX2xpc3QvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9zdGFuemEvZ21kYl9tZXRhX2xpc3QvaW5kZXgudHNcIik7XG4iLCJpbnRlcmZhY2UgU3RhbnphSHRtbFBhcmFtIHtcbiAgYXBpX3VybDogc3RyaW5nO1xuICBxdWVyeTogc3RyaW5nO1xuICBvZmZzZXQ6IHN0cmluZztcbiAgbGltaXQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEhUTUxQYXJhbXMge1xuICBjb2x1bW5MYWJlbHM6IHN0cmluZ1tdO1xuICBkYXRhOiBJdGVtW11bXTtcbiAgcGFnZTogbnVtYmVyO1xufVxuXG5cblN0YW56YTxTdGFuemFIdG1sUGFyYW0+KGZ1bmN0aW9uKHN0YW56YSwgcGFyYW1zKSB7XG4gIHJlbmRlcihzdGFuemEsIHByb2Nlc3NEYXRhKG15RGF0YSwgMSkpO1xufSk7XG5cblxuY29uc3QgcmVuZGVyID0gKHN0YW56YTogU3RhbnphSW5zdGFuY2UsIHBhcmFtczogSFRNTFBhcmFtcykgPT4ge1xuICBzdGFuemEucmVuZGVyKHtcbiAgICB0ZW1wbGF0ZTogXCJzdGFuemEuaHRtbFwiLFxuICAgIHBhcmFtZXRlcnM6IHBhcmFtc1xuICB9KTtcbiAgc3RhbnphLnNlbGVjdChcIiNteUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBwcm9jZXNzRGF0YShteURhdGEsIHBhcmFtcy5wYWdlICsgMSk7XG4gICAgcmVuZGVyKHN0YW56YSwgZGF0YSk7XG4gIH0pO1xufTtcblxuY29uc3QgcHJvY2Vzc0RhdGEgPSAocmVzcG9uc2U6IEFQSVJlc3BvbnNlLCBwYWdlOiBudW1iZXIpOiBIVE1MUGFyYW1zID0+IHtcbiAgY29uc3QgY29sdW1uTGFiZWxzOiBzdHJpbmdbXSA9IHJlc3BvbnNlLmNvbHVtbnMubWFwKGl0ZW0gPT4gaXRlbS5sYWJlbCk7XG4gIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gcmVzcG9uc2UuY29sdW1ucy5tYXAoaXRlbSA9PiBpdGVtLmtleSk7XG4gIGNvbnN0IGRhdGE6IEl0ZW1bXVtdID0gcmVzcG9uc2UuY29udGVudHMubWFwKGl0ZW0gPT4ge1xuICAgIGNvbnN0IHJlc3VsdDogSXRlbVtdID0gW107XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1ba2V5XTtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHBhZ2U6IHBhZ2UsXG4gICAgY29sdW1uTGFiZWxzLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcbn07XG5cbmNvbnN0IG15RGF0YTogQVBJUmVzcG9uc2UgPSB7XG4gIHRvdGFsOiA5OTk5LFxuICBvZmZzZXQ6IDEsXG4gIGNvbnRlbnRzOiBbXG4gICAge1xuICAgICAgZ21faWQ6IHtcbiAgICAgICAgaHJlZjogXCIvbWVkaWEvU1kzNy9cIixcbiAgICAgICAgbGFiZWw6IFwiU1kzN1wiXG4gICAgICB9LFxuICAgICAgbmFtZTogXCJCSEkgdy8gaGVhdC1pbmFjdGl2YXRlZCBGZXRhbCBCb3ZpbmUgU2VydW0gYW5kIEdsdWNvc2VcIlxuICAgIH0sXG4gICAge1xuICAgICAgZ21faWQ6IHtcbiAgICAgICAgaHJlZjogXCIvbWVkaWEvU1k0M3FcIixcbiAgICAgICAgbGFiZWw6IFwiU1k0M2FcIlxuICAgICAgfSxcbiAgICAgIG5hbWU6IFwiQkwgQUdBUiAoR0xVQ09TRSBCTE9PRCBMSVZFUiBBR0FSKVwiXG4gICAgfVxuICBdLFxuICBjb2x1bW5zOiBbXG4gICAge1xuICAgICAga2V5OiBcImdtX2lkXCIsXG4gICAgICBsYWJlbDogXCJHTSBJRFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6IFwibmFtZVwiLFxuICAgICAgbGFiZWw6IFwiTkFNRVwiXG4gICAgfSxcbiAgXVxufTtcblxuXG50eXBlIEl0ZW0gPSAoc3RyaW5nIHwgTGlua0l0ZW0pO1xuXG5pbnRlcmZhY2UgQVBJUmVzcG9uc2Uge1xuICB0b3RhbDogbnVtYmVyO1xuICBvZmZzZXQ6IG51bWJlcjtcbiAgY29udGVudHM6IENvbnRlbnRbXTtcbiAgY29sdW1uczogQ29sdW1uW107XG59XG5cbmludGVyZmFjZSBDb250ZW50IHtcbiAgW2tleTogc3RyaW5nXTogSXRlbTtcbn1cblxuaW50ZXJmYWNlIExpbmtJdGVtIHtcbiAgaHJlZjogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ29sdW1uIHtcbiAga2V5OiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cblxuXG5cbiJdLCJzb3VyY2VSb290IjoiIn0=