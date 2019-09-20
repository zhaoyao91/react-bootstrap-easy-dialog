"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogProvider = DialogProvider;
exports.useDialog = useDialog;
exports.Dialog = Dialog;
exports.DialogUI = DialogUI;
exports.DialogConsumer = exports.DialogContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Modal = _interopRequireDefault(require("react-bootstrap/Modal"));

var _Button = _interopRequireDefault(require("react-bootstrap/Button"));

var _Form = _interopRequireDefault(require("react-bootstrap/Form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var DialogContext = (0, _react.createContext)(null);
exports.DialogContext = DialogContext;

function DialogProvider(_ref) {
  var children = _ref.children,
      options = _objectWithoutProperties(_ref, ["children"]);

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      showOptions = _useState2[0],
      setShowOptions = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      show = _useState4[0],
      setShow = _useState4[1];

  var exitedRef = (0, _react.useRef)(true);
  var cancelRef = (0, _react.useRef)(); // unmount 的时候，如果还有 dialog 开着，启动它的正常 cancel 流程

  (0, _react.useEffect)(function () {
    return function () {
      cancelRef.current && cancelRef.current();
    };
  }, []);

  function handleExited() {
    setShowOptions({});
    exitedRef.current = true;
  }

  var dialog = (0, _react.useMemo)(function () {
    function buildMethod(buildOptions, failValue) {
      return (
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(text, options) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(exitedRef.current === false)) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return", failValue);

                  case 2:
                    return _context.abrupt("return", new Promise(function (resolve) {
                      setShow(true);
                      exitedRef.current = false;

                      function done(result) {
                        setShow(false);
                        cancelRef.current = null;
                        resolve(result);
                      }

                      var finalOptions = buildOptions(done);
                      cancelRef.current = finalOptions.onCancel;
                      setShowOptions(_objectSpread({
                        text: text
                      }, options, {}, finalOptions));
                    }));

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x, _x2) {
            return _ref2.apply(this, arguments);
          };
        }()
      );
    }

    return {
      alert: buildMethod(function (done) {
        return {
          input: false,
          cancelButton: false,
          confirmButton: true,
          onCancel: function onCancel() {
            return done(false);
          },
          onConfirm: function onConfirm() {
            return done(true);
          }
        };
      }, false),
      confirm: buildMethod(function (done) {
        return {
          input: false,
          cancelButton: true,
          confirmButton: true,
          onCancel: function onCancel() {
            return done(false);
          },
          onConfirm: function onConfirm() {
            return done(true);
          }
        };
      }, false),
      prompt: buildMethod(function (done) {
        return {
          input: true,
          cancelButton: true,
          confirmButton: true,
          onCancel: function onCancel() {
            return done(null);
          },
          onConfirm: function onConfirm(inputValue) {
            return done(inputValue);
          }
        };
      }, null)
    };
  }, []);

  var mergedOptions = _objectSpread({}, options, {}, showOptions, {
    show: show,
    onExited: handleExited
  }); // 当 animation === false 的时候，onExited 不会触发
  // 因此，当 show 变成 false 的时候，认为 exited 完成


  (0, _react.useEffect)(function () {
    if (!show && mergedOptions.animation === false) {
      handleExited();
    }
  }, [show, mergedOptions.animation]);
  return _react["default"].createElement(DialogContext.Provider, {
    value: dialog
  }, children, _react["default"].createElement(DialogUI, mergedOptions));
}

var DialogConsumer = DialogContext.Consumer;
exports.DialogConsumer = DialogConsumer;

function useDialog() {
  return (0, _react.useContext)(DialogContext);
}

function Dialog(_ref3) {
  var children = _ref3.children,
      options = _objectWithoutProperties(_ref3, ["children"]);

  return _react["default"].createElement(DialogProvider, options, _react["default"].createElement(DialogConsumer, null, children));
}

function DialogUI(_ref4) {
  var show = _ref4.show,
      title = _ref4.title,
      text = _ref4.text,
      input = _ref4.input,
      inputProps = _ref4.inputProps,
      cancelButton = _ref4.cancelButton,
      cancelButtonProps = _ref4.cancelButtonProps,
      confirmButton = _ref4.confirmButton,
      confirmButtonProps = _ref4.confirmButtonProps,
      onConfirm = _ref4.onConfirm,
      onCancel = _ref4.onCancel,
      onExited = _ref4.onExited,
      _ref4$autoFocus = _ref4.autoFocus,
      autoFocus = _ref4$autoFocus === void 0 ? "select" : _ref4$autoFocus,
      _ref4$stubborn = _ref4.stubborn,
      stubborn = _ref4$stubborn === void 0 ? true : _ref4$stubborn,
      _ref4$centered = _ref4.centered,
      centered = _ref4$centered === void 0 ? true : _ref4$centered,
      _ref4$animation = _ref4.animation,
      animation = _ref4$animation === void 0 ? true : _ref4$animation,
      scrollable = _ref4.scrollable,
      size = _ref4.size;

  var _ref5 = inputProps || {},
      _ref5$defaultValue = _ref5.defaultValue,
      defaultValue = _ref5$defaultValue === void 0 ? "" : _ref5$defaultValue,
      _ref5$refKey = _ref5.refKey,
      refKey = _ref5$refKey === void 0 ? "ref" : _ref5$refKey,
      otherInputProps = _objectWithoutProperties(_ref5, ["defaultValue", "refKey"]);

  var _useState5 = (0, _react.useState)(defaultValue),
      _useState6 = _slicedToArray(_useState5, 2),
      inputValue = _useState6[0],
      setInputValue = _useState6[1];

  var inputRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    setInputValue(defaultValue);
  }, [defaultValue]);
  (0, _react.useEffect)(function () {
    if (show && input && autoFocus) {
      inputRef.current.focus();

      if (autoFocus === "select") {
        setImmediate(function () {
          inputRef.current && inputRef.current.select();
        });
      }
    }
  }, [show, input, autoFocus]);
  var showHeader = !!title;
  var showBody = !!text || !!input;

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm(inputValue);
  }

  function handleConfirm() {
    onConfirm(inputValue);
  }

  function handleHide() {
    if (!stubborn) {
      onCancel();
    }
  }

  function handleCancel() {
    onCancel();
  }

  function handleInputValueChange(e) {
    setInputValue(e.target.value);
  }

  return _react["default"].createElement(_Modal["default"], {
    show: show,
    onHide: handleHide,
    centered: centered,
    onExited: onExited,
    animation: animation,
    scrollable: scrollable,
    size: size
  }, showHeader && _react["default"].createElement(_Modal["default"].Header, null, _react["default"].createElement(_Modal["default"].Title, null, title)), showBody && _react["default"].createElement(_Modal["default"].Body, null, !!text && _react["default"].createElement("p", {
    style: {
      marginBottom: input ? undefined : 0
    }
  }, text), input && _react["default"].createElement(_Form["default"], {
    onSubmit: handleSubmit
  }, input && _react["default"].createElement(_Form["default"].Control, _extends({}, otherInputProps, {
    value: inputValue,
    onChange: handleInputValueChange
  }, _defineProperty({}, refKey, inputRef))))), _react["default"].createElement(_Modal["default"].Footer, null, cancelButton && _react["default"].createElement(_Button["default"], _extends({
    variant: "secondary",
    children: "Cancel"
  }, cancelButtonProps, {
    onClick: handleCancel
  })), confirmButton && _react["default"].createElement(_Button["default"], _extends({
    variant: "primary",
    children: "Confirm"
  }, confirmButtonProps, {
    onClick: handleConfirm
  }))));
}