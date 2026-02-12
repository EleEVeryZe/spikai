import "./chunk-ARRHGH5T.js";
import {
  isPlatformBrowser
} from "./chunk-I7L3TOJS.js";
import {
  CSP_NONCE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵviewQuery
} from "./chunk-QZPWF3WP.js";
import "./chunk-6Q4RANH6.js";
import {
  fromEventPattern
} from "./chunk-FFZIAYYX.js";
import {
  BehaviorSubject,
  Observable,
  Subject,
  __async,
  __spreadProps,
  __spreadValues,
  of,
  switchMap,
  takeUntil
} from "./chunk-CXCX2JKZ.js";

// node_modules/safevalues/dist/mjs/environment/dev.js
(() => {
  if (typeof process === "undefined") {
    window.process = {
      env: {
        NODE_ENV: "development"
      }
    };
  }
})();

// node_modules/safevalues/dist/mjs/internals/secrets.js
var secretToken = {};
function ensureTokenIsValid(token) {
  if (true) {
    if (token !== secretToken) {
      throw new Error("Bad secret");
    }
  }
}

// node_modules/safevalues/dist/mjs/internals/string_literal.js
function assertIsTemplateObject(templateObj, numExprs) {
  if (!isTemplateObject(templateObj) || numExprs + 1 !== templateObj.length) {
    throw new TypeError(`
    ############################## ERROR ##############################

    It looks like you are trying to call a template tag function (fn\`...\`)
    using the normal function syntax (fn(...)), which is not supported.

    The functions in the safevalues library are not designed to be called
    like normal functions, and doing so invalidates the security guarantees
    that safevalues provides.

    If you are stuck and not sure how to proceed, please reach out to us
    instead through:
     - https://github.com/google/safevalues/issues

    ############################## ERROR ##############################`);
  }
}
function checkFrozen(templateObj) {
  return Object.isFrozen(templateObj) && Object.isFrozen(templateObj.raw);
}
function checkTranspiled(fn) {
  return fn.toString().indexOf("`") === -1;
}
var isTranspiled = checkTranspiled((tag) => tag``) || checkTranspiled((tag) => tag`\0`) || checkTranspiled((tag) => tag`\n`) || checkTranspiled((tag) => tag`\u0000`);
var frozenTSA = checkFrozen`` && checkFrozen`\0` && checkFrozen`\n` && checkFrozen`\u0000`;
function isTemplateObject(templateObj) {
  if (!Array.isArray(templateObj) || !Array.isArray(templateObj.raw)) {
    return false;
  }
  if (templateObj.length !== templateObj.raw.length) {
    return false;
  }
  if (!isTranspiled && templateObj === templateObj.raw) {
    return false;
  }
  if ((!isTranspiled || frozenTSA) && !checkFrozen(templateObj)) {
    return false;
  }
  return true;
}

// node_modules/safevalues/dist/mjs/internals/trusted_types.js
var configuredPolicyName = "google#safe";
var policyName = configuredPolicyName;
var trustedTypes = globalThis.trustedTypes;
var trustedTypesInternal = trustedTypes;
var policy;
function createPolicy() {
  let policy2 = null;
  if (policyName === "") {
    return policy2;
  }
  if (!trustedTypesInternal) {
    return policy2;
  }
  try {
    const identity = (x) => x;
    policy2 = trustedTypesInternal.createPolicy(policyName, {
      createHTML: identity,
      createScript: identity,
      createScriptURL: identity
    });
  } catch (e) {
    if (true) {
      throw e;
    }
  }
  return policy2;
}
function getPolicy() {
  if (policy === void 0) {
    policy = createPolicy();
  }
  return policy;
}

// node_modules/safevalues/dist/mjs/internals/pure.js
function pure(valueOf) {
  return {
    valueOf
  }.valueOf();
}

// node_modules/safevalues/dist/mjs/internals/html_impl.js
var SafeHtml = class {
  constructor(token, value) {
    if (true) {
      ensureTokenIsValid(token);
    }
    this.privateDoNotAccessOrElseWrappedHtml = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedHtml + "";
  }
};
var HtmlImpl = SafeHtml;
function constructHtml(value) {
  return new HtmlImpl(secretToken, value);
}
function createHtmlInternal(value) {
  const noinlineValue = value;
  const policy2 = getPolicy();
  return constructHtml(policy2 ? policy2.createHTML(noinlineValue) : noinlineValue);
}
var EMPTY_HTML = pure(() => constructHtml(trustedTypes ? trustedTypes.emptyHTML : ""));
function isHtml(value) {
  return value instanceof SafeHtml;
}
function unwrapHtml(value) {
  if (isHtml(value)) {
    return value.privateDoNotAccessOrElseWrappedHtml;
  } else {
    let message = "";
    if (true) {
      message = "Unexpected type when unwrapping SafeHtml";
    }
    throw new Error(message);
  }
}

// node_modules/safevalues/dist/mjs/internals/resource_url_impl.js
var TrustedResourceUrl = class {
  constructor(token, value) {
    if (true) {
      ensureTokenIsValid(token);
    }
    this.privateDoNotAccessOrElseWrappedResourceUrl = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedResourceUrl + "";
  }
};
var ResourceUrlImpl = TrustedResourceUrl;
function constructResourceUrl(value) {
  return new ResourceUrlImpl(secretToken, value);
}
function createResourceUrlInternal(value) {
  const noinlineValue = value;
  const policy2 = getPolicy();
  return constructResourceUrl(policy2 ? policy2.createScriptURL(noinlineValue) : noinlineValue);
}
function isResourceUrl(value) {
  return value instanceof TrustedResourceUrl;
}
function unwrapResourceUrl(value) {
  if (isResourceUrl(value)) {
    return value.privateDoNotAccessOrElseWrappedResourceUrl;
  } else {
    let message = "";
    if (true) {
      message = "Unexpected type when unwrapping TrustedResourceUrl";
    }
    throw new Error(message);
  }
}

// node_modules/safevalues/dist/mjs/internals/script_impl.js
var SafeScript = class {
  constructor(token, value) {
    if (true) {
      ensureTokenIsValid(token);
    }
    this.privateDoNotAccessOrElseWrappedScript = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedScript + "";
  }
};
var ScriptImpl = SafeScript;
function constructScript(value) {
  return new ScriptImpl(secretToken, value);
}
var EMPTY_SCRIPT = pure(() => constructScript(trustedTypes ? trustedTypes.emptyScript : ""));

// node_modules/safevalues/dist/mjs/builders/html_builders.js
function nodeToHtmlInternal(node, temporaryRoot) {
  temporaryRoot.appendChild(node);
  let serializedNewTree = new XMLSerializer().serializeToString(temporaryRoot);
  serializedNewTree = serializedNewTree.slice(serializedNewTree.indexOf(">") + 1, serializedNewTree.lastIndexOf("</"));
  return createHtmlInternal(serializedNewTree);
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/css/allowlists.js
var CSS_PROPERTY_ALLOWLIST = /* @__PURE__ */ new Set([
  "accent-color",
  // 'additive-symbols', -> only valid in @counter-style, which we disallow
  "align-content",
  "align-items",
  "align-self",
  "alignment-baseline",
  "all",
  "appearance",
  // 'ascent-override', -> only valid in @font-face, which we disallow
  "aspect-ratio",
  "backdrop-filter",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  // 'base-palette', -> only valid in @font-palette-values, which we disallow
  // 'baseline-shift',
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-shadow",
  "box-sizing",
  // 'break-after', -> all break-* properties can affect printing.
  // 'break-before',
  // 'break-inside',
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-scheme",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "contain-intrinsic-block-size",
  "contain-intrinsic-height",
  "contain-intrinsic-inline-size",
  "contain-intrinsic-size",
  "contain-intrinsic-width",
  // 'container', -> container-* are valid with @container, which we disallow
  // 'container-name',
  // 'container-type',
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "counter-set",
  // 'cursor', -> allows setting the cursor
  "cx",
  "cy",
  "d",
  // 'descent-override', -> only valid in @font-face, which we disallow
  "display",
  "dominant-baseline",
  "empty-cells",
  // 'fallback', -> only valid in at-rules
  "field-sizing",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flood-color",
  "flood-opacity",
  "font",
  // 'font-display', -> only valid in @font-face, which we disallow
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-optical-sizing",
  "font-palette",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-synthesis-small-caps",
  "font-synthesis-style",
  "font-synthesis-weight",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-emoji",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "forced-color-adjust",
  "gap",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-gap",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-gap",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "height",
  "hyphenate-character",
  "hyphenate-limit-chars",
  "hyphens",
  "image-orientation",
  "image-rendering",
  // 'inherits', -> only valid in @property, which we disallow
  // 'initial-letter', -> experimental
  // 'initial-value', -> experimental
  "inline-size",
  "inset",
  "inset-area",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "left",
  "letter-spacing",
  "lighting-color",
  "line-break",
  "line-clamp",
  "line-gap-override",
  "line-height",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "marker",
  "marker-end",
  "marker-mid",
  "marker-start",
  "mask",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  // 'math-depth', -> only relevant for MathML elements
  // 'math-shift', -> only relevant for MathML elements
  // 'math-style', -> only relevant for MathML elements
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  // 'navigation', -> experimental
  // 'negative', -> only valid in @counter-style, which we disallow
  "object-fit",
  "object-position",
  "object-view-box",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-anchor",
  "overflow-block",
  "overflow-clip-margin",
  "overflow-inline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  // 'overlay', -> experimental
  // 'override-colors', -> only valid in @font-palette-values, which we disallow
  // 'overscroll-behavior', -> can affect scrolling
  // 'overscroll-behavior-block', -> can affect scrolling
  // 'overscroll-behavior-inline', -> can affect scrolling
  // 'overscroll-behavior-x', -> can affect scrolling
  // 'overscroll-behavior-y', -> can affect scrolling
  // 'pad', -> only valid in @counter-style, which we disallow
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  // 'page', -> only valid with @page, which we disallow
  // 'page-break-after', -> too powerful, affects page breaks
  // 'page-break-before', -> too powerful, affects page breaks
  // 'page-break-inside', -> too powerful, affects page breaks
  // 'page-orientation', -> only valid in @page, which we disallow
  "paint-order",
  "perspective",
  "perspective-origin",
  "place-content",
  "place-items",
  "place-self",
  // 'pointer-events', -> too powerful, can disable pointer events
  // 'popover-hide-delay', -> we don't want to allow popovers
  // 'popover-show-delay', -> we don't want to allow popovers
  "position",
  // 'position-anchor', -> experimental
  // 'position-try', -> experimental
  // 'position-try-options', -> experimental
  // 'position-try-order', -> experimental
  // 'position-visibility', -> experimental
  // 'prefix', -> only valid in @counter-style, which we disallow
  "quotes",
  "r",
  // 'range', -> only valid in @counter-style, which we disallow
  // 'reading-order-items', -> experimental
  "resize",
  "right",
  "rotate",
  "row-gap",
  "ruby-align",
  "ruby-position",
  "rx",
  "ry",
  "scale",
  // all scroll properties are too powerful for a CSS sanitizer and disallowed
  // 'scroll-behavior',
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "shape-rendering",
  // 'size', -> only valid in @page, which we disallow
  // 'size-adjust', -> only valid in @font-face, which we disallow
  // 'src', -> only valid in @font-face, which we disallow
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  // 'suffix', -> only valid in @counter-style, which we disallow
  // 'symbols', -> only valid in @counter-style, which we disallow
  // 'syntax', -> only valid in @property, which we disallow
  // 'system', -> only valid in @counter-style, which we disallow
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-last",
  "text-anchor",
  "text-autospace",
  "text-box-edge",
  "text-box-trim",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-size-adjust",
  "text-spacing",
  "text-spacing-trim",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "text-wrap",
  // 'timeline-scope', -> experimental
  "top",
  // 'touch-action', -> affects behavior
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "translate",
  "unicode-bidi",
  // 'unicode-range', -> only valid in @font-face, which we disallow
  // 'user-select', -> too powerful, can disable user selection
  "vector-effect",
  "vertical-align",
  // 'view-timeline', -> experimental
  // 'view-timeline-axis', -> experimental
  // 'view-timeline-inset', -> experimental
  // 'view-timeline-name', -> experimental
  // 'view-transition-class', -> view-transitions are too powerful for CSS sanitizer
  // 'view-transition-name',
  "visibility",
  "white-space",
  "white-space-collapse",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "x",
  "y",
  "z-index",
  "zoom",
  // Animation properties
  // go/keep-sorted start
  "animation",
  "animation-composition",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-range",
  "animation-range-end",
  "animation-range-start",
  "animation-timeline",
  "animation-timing-function",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  // go/keep-sorted end
  // Transition properties
  // go/keep-sorted start
  "transition",
  "transition-behavior",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function"
  // go/keep-sorted end
]);
var CSS_FUNCTION_ALLOWLIST = /* @__PURE__ */ new Set([
  // go/keep-sorted start
  "alpha",
  "cubic-bezier",
  "linear-gradient",
  "matrix",
  "perspective",
  "radial-gradient",
  "rect",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "rgb",
  "rgba",
  "rotate",
  "rotate3d",
  "rotatex",
  "rotatey",
  "rotatez",
  "scale",
  "scale3d",
  "scalex",
  "scaley",
  "scalez",
  "skew",
  "skewx",
  "skewy",
  "steps",
  "translate",
  "translate3d",
  "translatex",
  "translatey",
  "translatez",
  "url"
  // go/keep-sorted end
]);

// node_modules/safevalues/dist/mjs/internals/style_sheet_impl.js
var SafeStyleSheet = class {
  constructor(token, value) {
    if (true) {
      ensureTokenIsValid(token);
    }
    this.privateDoNotAccessOrElseWrappedStyleSheet = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedStyleSheet;
  }
};
var StyleSheetImpl = SafeStyleSheet;
function createStyleSheetInternal(value) {
  return new StyleSheetImpl(secretToken, value);
}
function isStyleSheet(value) {
  return value instanceof SafeStyleSheet;
}
function unwrapStyleSheet(value) {
  if (isStyleSheet(value)) {
    return value.privateDoNotAccessOrElseWrappedStyleSheet;
  }
  let message = "";
  if (true) {
    message = `Unexpected type when unwrapping SafeStyleSheet, got '${value}' of type '${typeof value}'`;
  }
  throw new Error(message);
}

// node_modules/safevalues/dist/mjs/dom/elements/style.js
function setStyleTextContent(elem, safeStyleSheet2) {
  elem.textContent = unwrapStyleSheet(safeStyleSheet2);
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/resource_url_policy.js
var ResourceUrlPolicyHintsType;
(function(ResourceUrlPolicyHintsType2) {
  ResourceUrlPolicyHintsType2[ResourceUrlPolicyHintsType2["STYLE_ELEMENT"] = 0] = "STYLE_ELEMENT";
  ResourceUrlPolicyHintsType2[ResourceUrlPolicyHintsType2["STYLE_ATTRIBUTE"] = 1] = "STYLE_ATTRIBUTE";
  ResourceUrlPolicyHintsType2[ResourceUrlPolicyHintsType2["HTML_ATTRIBUTE"] = 2] = "HTML_ATTRIBUTE";
})(ResourceUrlPolicyHintsType || (ResourceUrlPolicyHintsType = {}));
function parseUrl(value) {
  try {
    return new URL(value, window.document.baseURI);
  } catch (e) {
    return new URL("about:invalid");
  }
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/css/tokens.js
var CssTokenKind;
(function(CssTokenKind2) {
  CssTokenKind2[CssTokenKind2["AT_KEYWORD"] = 0] = "AT_KEYWORD";
  CssTokenKind2[CssTokenKind2["CDC"] = 1] = "CDC";
  CssTokenKind2[CssTokenKind2["CDO"] = 2] = "CDO";
  CssTokenKind2[CssTokenKind2["CLOSE_CURLY"] = 3] = "CLOSE_CURLY";
  CssTokenKind2[CssTokenKind2["CLOSE_PAREN"] = 4] = "CLOSE_PAREN";
  CssTokenKind2[CssTokenKind2["CLOSE_SQUARE"] = 5] = "CLOSE_SQUARE";
  CssTokenKind2[CssTokenKind2["COLON"] = 6] = "COLON";
  CssTokenKind2[CssTokenKind2["COMMA"] = 7] = "COMMA";
  CssTokenKind2[CssTokenKind2["DELIM"] = 8] = "DELIM";
  CssTokenKind2[CssTokenKind2["DIMENSION"] = 9] = "DIMENSION";
  CssTokenKind2[CssTokenKind2["EOF"] = 10] = "EOF";
  CssTokenKind2[CssTokenKind2["FUNCTION"] = 11] = "FUNCTION";
  CssTokenKind2[CssTokenKind2["HASH"] = 12] = "HASH";
  CssTokenKind2[CssTokenKind2["IDENT"] = 13] = "IDENT";
  CssTokenKind2[CssTokenKind2["NUMBER"] = 14] = "NUMBER";
  CssTokenKind2[CssTokenKind2["OPEN_CURLY"] = 15] = "OPEN_CURLY";
  CssTokenKind2[CssTokenKind2["OPEN_PAREN"] = 16] = "OPEN_PAREN";
  CssTokenKind2[CssTokenKind2["OPEN_SQUARE"] = 17] = "OPEN_SQUARE";
  CssTokenKind2[CssTokenKind2["PERCENTAGE"] = 18] = "PERCENTAGE";
  CssTokenKind2[CssTokenKind2["SEMICOLON"] = 19] = "SEMICOLON";
  CssTokenKind2[CssTokenKind2["STRING"] = 20] = "STRING";
  CssTokenKind2[CssTokenKind2["WHITESPACE"] = 21] = "WHITESPACE";
})(CssTokenKind || (CssTokenKind = {}));

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/css/serializer.js
function escapeCodePoint(c) {
  return `\\${c.codePointAt(0).toString(16)} `;
}
function escapeString(str) {
  return '"' + str.replace(/[^A-Za-z0-9_/. :,?=%;-]/g, (c) => escapeCodePoint(c)) + '"';
}
function escapeIdent(ident) {
  const firstChar = /^[^A-Za-z_]/.test(ident) ? escapeCodePoint(ident[0]) : ident[0];
  return firstChar + ident.slice(1).replace(/[^A-Za-z0-9_-]/g, (c) => escapeCodePoint(c));
}
function serializeToken(token) {
  switch (token.tokenKind) {
    case CssTokenKind.AT_KEYWORD:
      return `@${escapeIdent(token.name)}`;
    case CssTokenKind.CDC:
      return "-->";
    case CssTokenKind.CDO:
      return "<!--";
    case CssTokenKind.CLOSE_CURLY:
      return "}";
    case CssTokenKind.CLOSE_PAREN:
      return ")";
    case CssTokenKind.CLOSE_SQUARE:
      return "]";
    case CssTokenKind.COLON:
      return ":";
    case CssTokenKind.COMMA:
      return ",";
    case CssTokenKind.DELIM:
      if (token.codePoint === "\\") {
        return "\\\n";
      }
      return token.codePoint;
    case CssTokenKind.DIMENSION:
      return token.repr + escapeIdent(token.dimension);
    case CssTokenKind.EOF:
      return "";
    case CssTokenKind.FUNCTION:
      return escapeIdent(token.lowercaseName) + "(";
    case CssTokenKind.HASH:
      return "#" + escapeIdent(token.value);
    case CssTokenKind.IDENT:
      return escapeIdent(token.ident);
    case CssTokenKind.NUMBER:
      return token.repr;
    case CssTokenKind.OPEN_CURLY:
      return "{";
    case CssTokenKind.OPEN_PAREN:
      return "(";
    case CssTokenKind.OPEN_SQUARE:
      return "[";
    case CssTokenKind.PERCENTAGE:
      return token.repr + "%";
    case CssTokenKind.SEMICOLON:
      return ";";
    case CssTokenKind.STRING:
      return escapeString(token.value);
    case CssTokenKind.WHITESPACE:
      return " ";
    default:
      checkExhaustive(token);
  }
}
function serializeTokens(tokens) {
  return tokens.map(serializeToken).join("");
}
function checkExhaustive(value, msg = `unexpected value ${value}!`) {
  throw new Error(msg);
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/css/tokenizer.js
var HEX_DIGIT_REGEX = /^[0-9a-fA-F]$/;
var EOF = void 0;
var Tokenizer = class {
  constructor(css) {
    this.pos = 0;
    this.css = this.preprocess(css);
  }
  tokenize() {
    const tokens = [];
    let lastToken = EOF;
    while (true) {
      const token = this.consumeToken();
      if (Array.isArray(token)) {
        tokens.push(...token);
        continue;
      }
      const twoConsecutiveWhitespace = token.tokenKind === CssTokenKind.WHITESPACE && (lastToken === null || lastToken === void 0 ? void 0 : lastToken.tokenKind) === CssTokenKind.WHITESPACE;
      if (twoConsecutiveWhitespace) {
        continue;
      }
      tokens.push(token);
      if (token.tokenKind === CssTokenKind.EOF) {
        return tokens;
      }
      lastToken = token;
    }
  }
  /**
   * The first code point in the input stream that has not yet been consumed.
   *
   * https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#next-input-code-point
   */
  nextInputCodePoint() {
    return this.css[this.pos];
  }
  nextTwoInputCodePoints() {
    return [this.css[this.pos], this.css[this.pos + 1]];
  }
  nextThreeInputCodePoints() {
    return [this.css[this.pos], this.css[this.pos + 1], this.css[this.pos + 2]];
  }
  currentInputCodePoint() {
    return this.css[this.pos - 1];
  }
  nextNInputCodePoints(n) {
    return this.css.slice(this.pos, this.pos + n);
  }
  consumeTheNextInputCodePoint() {
    this.pos++;
  }
  consumeNInputCodePoints(n) {
    this.pos += n;
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#reconsume-the-current-input-code-point */
  reconsumeTheCurrentInputCodePoint() {
    this.pos--;
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#input-preprocessing */
  preprocess(css) {
    return css.replace(/[\x0d\x0c]|\x0d\x0a/g, "\n").replace(/\x00/g, "�");
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token */
  consumeToken() {
    const consumedComment = this.consumeComments();
    if (consumedComment) {
      return {
        tokenKind: CssTokenKind.WHITESPACE
      };
    }
    const codePoint = this.nextInputCodePoint();
    this.consumeTheNextInputCodePoint();
    if (codePoint === EOF) {
      return {
        tokenKind: CssTokenKind.EOF
      };
    } else if (this.isWhitespace(codePoint)) {
      this.consumeAsMuchWhitespaceAsPossible();
      return {
        tokenKind: CssTokenKind.WHITESPACE
      };
    } else if (codePoint === "'" || codePoint === '"') {
      return this.consumeString(codePoint);
    } else if (codePoint === "#") {
      if (this.isIdentCodePoint(this.nextInputCodePoint()) || this.twoCodePointsAreValidEscape(...this.nextTwoInputCodePoints())) {
        return {
          tokenKind: CssTokenKind.HASH,
          value: this.consumeIdentSequence()
        };
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "#"
        };
      }
    } else if (codePoint === "(") {
      return {
        tokenKind: CssTokenKind.OPEN_PAREN
      };
    } else if (codePoint === ")") {
      return {
        tokenKind: CssTokenKind.CLOSE_PAREN
      };
    } else if (codePoint === "+") {
      if (this.streamStartsWithANumber()) {
        this.reconsumeTheCurrentInputCodePoint();
        return this.consumeNumericToken();
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "+"
        };
      }
    } else if (codePoint === ",") {
      return {
        tokenKind: CssTokenKind.COMMA
      };
    } else if (codePoint === "-") {
      if (this.streamStartsWithANumber()) {
        this.reconsumeTheCurrentInputCodePoint();
        return this.consumeNumericToken();
      } else if (this.nextNInputCodePoints(2) === "->") {
        this.consumeNInputCodePoints(2);
        return {
          tokenKind: CssTokenKind.CDC
        };
      } else if (this.streamStartsWithAnIdentSequence()) {
        this.reconsumeTheCurrentInputCodePoint();
        return this.consumeIdentLikeToken();
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "-"
        };
      }
    } else if (codePoint === ".") {
      if (this.streamStartsWithANumber()) {
        this.reconsumeTheCurrentInputCodePoint();
        return this.consumeNumericToken();
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "."
        };
      }
    } else if (codePoint === ":") {
      return {
        tokenKind: CssTokenKind.COLON
      };
    } else if (codePoint === ";") {
      return {
        tokenKind: CssTokenKind.SEMICOLON
      };
    } else if (codePoint === "<") {
      if (this.nextNInputCodePoints(3) === "!--") {
        this.consumeNInputCodePoints(3);
        return {
          tokenKind: CssTokenKind.CDO
        };
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "<"
        };
      }
    } else if (codePoint === "@") {
      if (this.threeCodePointsWouldStartAnIdentSequence(...this.nextThreeInputCodePoints())) {
        const ident = this.consumeIdentSequence();
        return {
          tokenKind: CssTokenKind.AT_KEYWORD,
          name: ident
        };
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "@"
        };
      }
    } else if (codePoint === "\\") {
      if (this.streamStartsWithValidEscape()) {
        this.reconsumeTheCurrentInputCodePoint();
        return this.consumeIdentLikeToken();
      } else {
        return {
          tokenKind: CssTokenKind.DELIM,
          codePoint: "\\"
        };
      }
    } else if (codePoint === "[") {
      return {
        tokenKind: CssTokenKind.OPEN_SQUARE
      };
    } else if (codePoint === "]") {
      return {
        tokenKind: CssTokenKind.CLOSE_SQUARE
      };
    } else if (codePoint === "{") {
      return {
        tokenKind: CssTokenKind.OPEN_CURLY
      };
    } else if (codePoint === "}") {
      return {
        tokenKind: CssTokenKind.CLOSE_CURLY
      };
    } else if (this.isDigit(codePoint)) {
      this.reconsumeTheCurrentInputCodePoint();
      return this.consumeNumericToken();
    } else if (this.isIdentStartCodePoint(codePoint)) {
      this.reconsumeTheCurrentInputCodePoint();
      return this.consumeIdentLikeToken();
    } else {
      return {
        tokenKind: CssTokenKind.DELIM,
        codePoint
      };
    }
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comments */
  consumeComments() {
    let anyComments = false;
    while (this.nextNInputCodePoints(2) === "/*") {
      anyComments = true;
      this.consumeNInputCodePoints(2);
      const endIndex = this.css.indexOf("*/", this.pos);
      if (endIndex === -1) {
        this.pos = this.css.length;
        return anyComments;
      }
      this.pos = endIndex + 2;
    }
    return anyComments;
  }
  /**
   * https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
   *
   * @param quote The quote character that starts the string.
   */
  consumeString(quote) {
    const stringToken = {
      tokenKind: CssTokenKind.STRING,
      value: ""
    };
    while (true) {
      const codePoint = this.nextInputCodePoint();
      this.consumeTheNextInputCodePoint();
      if (codePoint === EOF || codePoint === quote) {
        return stringToken;
      } else if (this.isNewline(codePoint)) {
        this.reconsumeTheCurrentInputCodePoint();
        stringToken.value = "";
        return stringToken;
      } else if (codePoint === "\\") {
        if (this.nextInputCodePoint() === EOF) {
          continue;
        } else if (this.isNewline(this.nextInputCodePoint())) {
          this.consumeTheNextInputCodePoint();
        } else {
          const escapedCodePoint = this.consumeEscapedCodePoint();
          stringToken.value += escapedCodePoint;
        }
      } else {
        stringToken.value += codePoint;
      }
    }
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-an-escaped-code-point */
  consumeEscapedCodePoint() {
    const codePoint = this.nextInputCodePoint();
    this.consumeTheNextInputCodePoint();
    if (codePoint === EOF) {
      return "�";
    } else if (this.isHexDigit(codePoint)) {
      let hexDigits = codePoint;
      while (this.isHexDigit(this.nextInputCodePoint()) && hexDigits.length < 6) {
        hexDigits += this.nextInputCodePoint();
        this.consumeTheNextInputCodePoint();
      }
      if (this.isWhitespace(this.nextInputCodePoint())) {
        this.consumeTheNextInputCodePoint();
      }
      const num = parseInt(hexDigits, 16);
      return String.fromCodePoint(num);
    } else {
      return codePoint;
    }
  }
  consumeAsMuchWhitespaceAsPossible() {
    while (this.isWhitespace(this.nextInputCodePoint())) {
      this.consumeTheNextInputCodePoint();
    }
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-an-ident-sequence */
  consumeIdentSequence() {
    let result = "";
    while (true) {
      const codePoint = this.nextInputCodePoint();
      this.consumeTheNextInputCodePoint();
      const codePoint2 = this.nextInputCodePoint();
      if (this.isIdentCodePoint(codePoint)) {
        result += codePoint;
      } else if (this.twoCodePointsAreValidEscape(codePoint, codePoint2)) {
        result += this.consumeEscapedCodePoint();
      } else {
        this.reconsumeTheCurrentInputCodePoint();
        return result;
      }
    }
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-an-ident-like-token */
  consumeIdentLikeToken() {
    const ident = this.consumeIdentSequence();
    if (/^url$/i.test(ident) && this.nextInputCodePoint() === "(") {
      this.consumeTheNextInputCodePoint();
      while (this.nextTwoInputsPointsAreWhitespace()) {
        this.consumeTheNextInputCodePoint();
      }
      const nextTwo = this.nextTwoInputCodePoints();
      if (this.isWhitespace(nextTwo[0]) && (nextTwo[1] === '"' || nextTwo[1] === "'") || nextTwo[0] === '"' || nextTwo[0] === "'") {
        return {
          tokenKind: CssTokenKind.FUNCTION,
          lowercaseName: "url"
        };
      } else {
        return this.consumeUrlToken();
      }
    } else if (this.nextInputCodePoint() === "(") {
      this.consumeTheNextInputCodePoint();
      return {
        tokenKind: CssTokenKind.FUNCTION,
        lowercaseName: ident.toLowerCase()
      };
    }
    return {
      tokenKind: CssTokenKind.IDENT,
      ident
    };
  }
  /**
   * https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-a-url-token
   *
   * This method has a significant willful violation of the spec. Per spec,
   * URLs in CSS (such as "url(...)") can return two types of tokens, depending
   * on whether the argument is a quoted string or not.
   *
   * So `url(https://example.com)` returns a URL token, while
   * `url('https://example.com')` returns a function token, followed by a string
   * token, followed by a close paren token.
   *
   * Having two types of tokens for URL functions make the sanitization logic
   * more complicated and there's no real benefit to it.
   *
   * So this function will always return a function token, followed by a string
   * token, followed by a close paren token to be consistent.
   *
   * The spec also uses a bad-url token but we instead return an empty string
   * token.
   *
   */
  consumeUrlToken() {
    let url = "";
    this.consumeAsMuchWhitespaceAsPossible();
    while (true) {
      const codePoint = this.nextInputCodePoint();
      this.consumeTheNextInputCodePoint();
      if (codePoint === ")" || codePoint === EOF) {
        return this.createFunctionUrlToken(url);
      } else if (this.isWhitespace(codePoint)) {
        this.consumeAsMuchWhitespaceAsPossible();
        if (this.nextInputCodePoint() === ")" || this.nextInputCodePoint() === EOF) {
          this.consumeTheNextInputCodePoint();
          return this.createFunctionUrlToken(url);
        } else {
          this.consumeRemnantsOfBadUrl();
          return this.createFunctionUrlToken("");
        }
      } else if (codePoint === '"' || codePoint === "'" || codePoint === "(" || this.isNonPrintableCodePoint(codePoint)) {
        this.consumeRemnantsOfBadUrl();
        return this.createFunctionUrlToken("");
      } else if (codePoint === "\\") {
        if (this.streamStartsWithValidEscape()) {
          url += this.consumeEscapedCodePoint();
        } else {
          this.consumeRemnantsOfBadUrl();
          return this.createFunctionUrlToken("");
        }
      } else {
        url += codePoint;
      }
    }
  }
  /** Helper function to make `consumeUrlToken` a little more readable. */
  createFunctionUrlToken(url) {
    return [{
      tokenKind: CssTokenKind.FUNCTION,
      lowercaseName: "url"
    }, {
      tokenKind: CssTokenKind.STRING,
      value: url
    }, {
      tokenKind: CssTokenKind.CLOSE_PAREN
    }];
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-the-remnants-of-a-bad-url */
  consumeRemnantsOfBadUrl() {
    while (true) {
      const codePoint = this.nextInputCodePoint();
      this.consumeTheNextInputCodePoint();
      if (codePoint === EOF || codePoint === ")") {
        return;
      } else if (this.streamStartsWithValidEscape()) {
        this.consumeEscapedCodePoint();
      }
    }
  }
  /**
   * The function returns the original representation of the number; we don't
   * try to parse the number, as required by the spec.
   *
   * We also don't return the information whether a number is integer or not
   * since it's irrelevant for sanitization.
   *
   * https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
   */
  consumeNumber() {
    let repr = "";
    {
      const next = this.nextInputCodePoint();
      if (next === "+" || next === "-") {
        this.consumeTheNextInputCodePoint();
        repr += next;
      }
    }
    repr += this.consumeDigits();
    {
      const next = this.nextInputCodePoint();
      const next2 = this.css[this.pos + 1];
      if (next === "." && this.isDigit(next2)) {
        this.consumeTheNextInputCodePoint();
        repr += "." + this.consumeDigits();
      }
    }
    {
      const next = this.nextInputCodePoint();
      const next2 = this.css[this.pos + 1];
      const next3 = this.css[this.pos + 2];
      if (next === "e" || next === "E") {
        if ((next2 === "+" || next2 === "-") && this.isDigit(next3)) {
          this.consumeNInputCodePoints(2);
          repr += next + next2 + this.consumeDigits();
        } else if (this.isDigit(next2)) {
          this.consumeTheNextInputCodePoint();
          repr += next + this.consumeDigits();
        }
      }
    }
    return repr;
  }
  consumeDigits() {
    let repr = "";
    while (this.isDigit(this.nextInputCodePoint())) {
      repr += this.nextInputCodePoint();
      this.consumeTheNextInputCodePoint();
    }
    return repr;
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-numeric-token */
  consumeNumericToken() {
    const repr = this.consumeNumber();
    if (this.threeCodePointsWouldStartAnIdentSequence(...this.nextThreeInputCodePoints())) {
      return {
        tokenKind: CssTokenKind.DIMENSION,
        repr,
        dimension: this.consumeIdentSequence()
      };
    }
    if (this.nextInputCodePoint() === "%") {
      this.consumeTheNextInputCodePoint();
      return {
        tokenKind: CssTokenKind.PERCENTAGE,
        repr
      };
    }
    return {
      tokenKind: CssTokenKind.NUMBER,
      repr
    };
  }
  nextTwoInputsPointsAreWhitespace() {
    return this.nextTwoInputCodePoints().every((c) => this.isWhitespace(c));
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#check-if-two-code-points-are-a-valid-escape */
  twoCodePointsAreValidEscape(codePoint1, codePoint2) {
    return codePoint1 === "\\" && codePoint2 !== "\n";
  }
  streamStartsWithValidEscape() {
    return this.twoCodePointsAreValidEscape(this.currentInputCodePoint(), this.nextInputCodePoint());
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#check-if-three-code-points-would-start-a-number */
  threeCodePointsWouldStartANumber(codePoint1, codePoint2, codePoint3) {
    if (codePoint1 === "+" || codePoint1 === "-") {
      return this.isDigit(codePoint2) || codePoint2 === "." && this.isDigit(codePoint3);
    } else if (codePoint1 === ".") {
      return this.isDigit(codePoint2);
    } else {
      return this.isDigit(codePoint1);
    }
  }
  streamStartsWithANumber() {
    return this.threeCodePointsWouldStartANumber(this.currentInputCodePoint(), ...this.nextTwoInputCodePoints());
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#would-start-an-identifier */
  threeCodePointsWouldStartAnIdentSequence(codePoint1, codePoint2, codePoint3) {
    if (codePoint1 === "-") {
      if (this.isIdentStartCodePoint(codePoint2) || codePoint2 === "-") {
        return true;
      } else if (this.twoCodePointsAreValidEscape(codePoint2, codePoint3)) {
        return true;
      } else {
        return false;
      }
    } else if (this.isIdentStartCodePoint(codePoint1)) {
      return true;
    } else if (codePoint1 === "\\") {
      return this.twoCodePointsAreValidEscape(codePoint1, codePoint2);
    } else {
      return false;
    }
  }
  streamStartsWithAnIdentSequence() {
    return this.threeCodePointsWouldStartAnIdentSequence(this.currentInputCodePoint(), ...this.nextTwoInputCodePoints());
  }
  isDigit(codePoint) {
    return codePoint !== EOF && codePoint >= "0" && codePoint <= "9";
  }
  isHexDigit(codePoint) {
    return codePoint !== EOF && HEX_DIGIT_REGEX.test(codePoint);
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#newline */
  isNewline(codePoint) {
    return codePoint === "\n";
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace */
  isWhitespace(codePoint) {
    return codePoint === " " || codePoint === "	" || this.isNewline(codePoint);
  }
  /**
   * True for letters, digits, underscores, hyphens, and non-ASCII code points.
   *
   * https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
   */
  isIdentCodePoint(codePoint) {
    if (codePoint === void 0) {
      return false;
    }
    return /^([A-Za-z0-9_-]|[^\u0000-\u007f])$/.test(codePoint);
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-start-code-point */
  isIdentStartCodePoint(codePoint) {
    if (codePoint === void 0) {
      return false;
    }
    return /^([A-Za-z_]|[^\u0000-\u007f])$/.test(codePoint);
  }
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-printable-code-point */
  isNonPrintableCodePoint(codePoint) {
    if (codePoint === void 0) {
      return false;
    }
    return /[\x00-\x08\x0b\x0e-\x1f\x7f]/.test(codePoint);
  }
};
function tokenizeCss(css) {
  return new Tokenizer(css).tokenize();
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/css/sanitizer.js
var CssSanitizer = class {
  constructor(propertyAllowlist, functionAllowlist, resourceUrlPolicy, allowKeyframes, propertyDiscarders) {
    this.propertyAllowlist = propertyAllowlist;
    this.functionAllowlist = functionAllowlist;
    this.resourceUrlPolicy = resourceUrlPolicy;
    this.allowKeyframes = allowKeyframes;
    this.propertyDiscarders = propertyDiscarders;
    this.inertDocument = document.implementation.createHTMLDocument();
  }
  getStyleSheet(cssText) {
    const styleEl = this.inertDocument.createElement("style");
    const safeStyleSheet2 = createStyleSheetInternal(cssText);
    setStyleTextContent(styleEl, safeStyleSheet2);
    this.inertDocument.head.appendChild(styleEl);
    const sheet = styleEl.sheet;
    styleEl.remove();
    return sheet;
  }
  getStyleDeclaration(cssText) {
    const div = this.inertDocument.createElement("div");
    div.style.cssText = cssText;
    this.inertDocument.body.appendChild(div);
    const style = div.style;
    div.remove();
    return style;
  }
  hasShadowDomEscapingTokens(token, nextToken) {
    if (token.tokenKind !== CssTokenKind.COLON) {
      return false;
    }
    if (nextToken.tokenKind === CssTokenKind.IDENT && nextToken.ident.toLowerCase() === "host") {
      return true;
    }
    if (nextToken.tokenKind === CssTokenKind.FUNCTION && (nextToken.lowercaseName === "host" || nextToken.lowercaseName === "host-context")) {
      return true;
    }
    return false;
  }
  sanitizeSelector(selector) {
    const tokens = tokenizeCss(selector);
    for (let i = 0; i < tokens.length - 1; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];
      if (this.hasShadowDomEscapingTokens(token, nextToken)) {
        return null;
      }
    }
    return serializeTokens(tokens);
  }
  sanitizeValue(propertyName, value, calledFromStyleElement) {
    const tokens = tokenizeCss(value);
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.tokenKind !== CssTokenKind.FUNCTION) {
        continue;
      }
      if (!this.functionAllowlist.has(token.lowercaseName)) {
        return null;
      }
      if (token.lowercaseName === "url") {
        const nextToken = tokens[i + 1];
        if ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.tokenKind) !== CssTokenKind.STRING) {
          return null;
        }
        const url = nextToken.value;
        let parsedUrl = parseUrl(url);
        if (this.resourceUrlPolicy) {
          parsedUrl = this.resourceUrlPolicy(parsedUrl, {
            type: calledFromStyleElement ? ResourceUrlPolicyHintsType.STYLE_ELEMENT : ResourceUrlPolicyHintsType.STYLE_ATTRIBUTE,
            propertyName
          });
        }
        if (!parsedUrl) {
          return null;
        }
        tokens[i + 1] = {
          tokenKind: CssTokenKind.STRING,
          value: parsedUrl.toString()
        };
        i++;
      }
    }
    return serializeTokens(tokens);
  }
  sanitizeKeyframeRule(rule) {
    const sanitizedProperties = this.sanitizeStyleDeclaration(rule.style, true);
    return `${rule.keyText} { ${sanitizedProperties} }`;
  }
  sanitizeKeyframesRule(keyframesRule) {
    if (!this.allowKeyframes) {
      return null;
    }
    const keyframeRules = [];
    for (const rule of keyframesRule.cssRules) {
      if (!(rule instanceof CSSKeyframeRule)) {
        continue;
      }
      const sanitizedRule = this.sanitizeKeyframeRule(rule);
      if (sanitizedRule) {
        keyframeRules.push(sanitizedRule);
      }
    }
    return `@keyframes ${escapeIdent(keyframesRule.name)} { ${keyframeRules.join(" ")} }`;
  }
  isPropertyNameAllowed(name) {
    if (!this.propertyAllowlist.has(name)) {
      return false;
    }
    for (const discarder of this.propertyDiscarders) {
      if (discarder(name)) {
        return false;
      }
    }
    return true;
  }
  sanitizeProperty(name, value, isImportant, calledFromStyleElement) {
    if (!this.isPropertyNameAllowed(name)) {
      return null;
    }
    const sanitizedValue = this.sanitizeValue(name, value, calledFromStyleElement);
    if (!sanitizedValue) {
      return null;
    }
    return `${escapeIdent(name)}: ${sanitizedValue}${isImportant ? " !important" : ""}`;
  }
  sanitizeStyleDeclaration(style, calledFromStyleElement) {
    const sortedPropertyNames = [...style].sort();
    let sanitizedProperties = "";
    for (const name of sortedPropertyNames) {
      const value = style.getPropertyValue(name);
      const isImportant = style.getPropertyPriority(name) === "important";
      const sanitizedProperty = this.sanitizeProperty(name, value, isImportant, calledFromStyleElement);
      if (sanitizedProperty) {
        sanitizedProperties += sanitizedProperty + ";";
      }
    }
    return sanitizedProperties;
  }
  sanitizeStyleRule(rule) {
    const selector = this.sanitizeSelector(rule.selectorText);
    if (!selector) {
      return null;
    }
    const sanitizedProperties = this.sanitizeStyleDeclaration(rule.style, true);
    return `${selector} { ${sanitizedProperties} }`;
  }
  sanitizeStyleElement(cssText) {
    const styleSheet = this.getStyleSheet(cssText);
    const rules = styleSheet.cssRules;
    const output = [];
    for (const rule of rules) {
      if (rule instanceof CSSStyleRule) {
        const sanitizedRule = this.sanitizeStyleRule(rule);
        if (sanitizedRule) {
          output.push(sanitizedRule);
        }
      } else if (rule instanceof CSSKeyframesRule) {
        const sanitizedRule = this.sanitizeKeyframesRule(rule);
        if (sanitizedRule) {
          output.push(sanitizedRule);
        }
      }
    }
    return output.join("\n");
  }
  sanitizeStyleAttribute(cssText) {
    const styleDeclaration = this.getStyleDeclaration(cssText);
    return this.sanitizeStyleDeclaration(styleDeclaration, false);
  }
};
function sanitizeStyleElement(cssText, propertyAllowlist, functionAllowlist, resourceUrlPolicy, allowKeyframes, propertyDiscarders) {
  return new CssSanitizer(propertyAllowlist, functionAllowlist, resourceUrlPolicy, allowKeyframes, propertyDiscarders).sanitizeStyleElement(cssText);
}
function sanitizeStyleAttribute(cssText, propertyAllowlist, functionAllowlist, resourceUrlPolicy, propertyDiscarders) {
  return new CssSanitizer(
    propertyAllowlist,
    functionAllowlist,
    resourceUrlPolicy,
    false,
    // allowKeyframes is not relevant for the style attribute
    propertyDiscarders
  ).sanitizeStyleAttribute(cssText);
}

// node_modules/safevalues/dist/mjs/builders/url_builders.js
function extractScheme(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (e) {
    return "https:";
  }
  return parsedUrl.protocol;
}
var ALLOWED_SCHEMES = ["data:", "http:", "https:", "mailto:", "ftp:"];
function restrictivelySanitizeUrl(url) {
  const parsedScheme = extractScheme(url);
  if (parsedScheme !== void 0 && ALLOWED_SCHEMES.indexOf(parsedScheme.toLowerCase()) !== -1) {
    return url;
  }
  return "about:invalid#zClosurez";
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/css/css_isolation.js
var CSS_ISOLATION_PROPERTIES = "display:inline-block;clip-path:inset(0);overflow:hidden;vertical-align:top;text-decoration:inherit";
var CSS_ISOLATION_STYLESHEET = `:host{${CSS_ISOLATION_PROPERTIES}}`;

// node_modules/safevalues/dist/mjs/dom/globals/range.js
function rangeCreateContextualFragment(range, html) {
  return range.createContextualFragment(unwrapHtml(html));
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/inert_fragment.js
function createInertFragment(dirtyHtml, inertDocument) {
  if (true) {
    if (inertDocument.defaultView) {
      throw new Error("createInertFragment called with non-inert document");
    }
  }
  const range = inertDocument.createRange();
  range.selectNode(inertDocument.body);
  const temporarySafeHtml = createHtmlInternal(dirtyHtml);
  return rangeCreateContextualFragment(range, temporarySafeHtml);
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/no_clobber.js
function getNodeName(node) {
  const nodeName = node.nodeName;
  return typeof nodeName === "string" ? nodeName : "FORM";
}
function isText(node) {
  return node.nodeType === 3;
}
function isElement(node) {
  const nodeType = node.nodeType;
  return nodeType === 1 || typeof nodeType !== "number";
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/sanitizer_table/sanitizer_table.js
var SanitizerTable = class {
  constructor(allowedElements, elementPolicies, allowedGlobalAttributes, globalAttributePolicies, globallyAllowedAttributePrefixes) {
    this.allowedElements = allowedElements;
    this.elementPolicies = elementPolicies;
    this.allowedGlobalAttributes = allowedGlobalAttributes;
    this.globalAttributePolicies = globalAttributePolicies;
    this.globallyAllowedAttributePrefixes = globallyAllowedAttributePrefixes;
  }
  isAllowedElement(elementName) {
    return elementName !== "FORM" && (this.allowedElements.has(elementName) || this.elementPolicies.has(elementName));
  }
  getAttributePolicy(attributeName, elementName) {
    const elementPolicy = this.elementPolicies.get(elementName);
    if (elementPolicy === null || elementPolicy === void 0 ? void 0 : elementPolicy.has(attributeName)) {
      return elementPolicy.get(attributeName);
    }
    if (this.allowedGlobalAttributes.has(attributeName)) {
      return {
        policyAction: AttributePolicyAction.KEEP
      };
    }
    const globalPolicy = this.globalAttributePolicies.get(attributeName);
    if (globalPolicy) {
      return globalPolicy;
    }
    if (this.globallyAllowedAttributePrefixes && [...this.globallyAllowedAttributePrefixes].some((prefix) => attributeName.indexOf(prefix) === 0)) {
      return {
        policyAction: AttributePolicyAction.KEEP
      };
    }
    return {
      policyAction: AttributePolicyAction.DROP
    };
  }
};
var AttributePolicyAction;
(function(AttributePolicyAction2) {
  AttributePolicyAction2[AttributePolicyAction2["DROP"] = 0] = "DROP";
  AttributePolicyAction2[AttributePolicyAction2["KEEP"] = 1] = "KEEP";
  AttributePolicyAction2[AttributePolicyAction2["KEEP_AND_SANITIZE_URL"] = 2] = "KEEP_AND_SANITIZE_URL";
  AttributePolicyAction2[AttributePolicyAction2["KEEP_AND_NORMALIZE"] = 3] = "KEEP_AND_NORMALIZE";
  AttributePolicyAction2[AttributePolicyAction2["KEEP_AND_SANITIZE_STYLE"] = 4] = "KEEP_AND_SANITIZE_STYLE";
  AttributePolicyAction2[AttributePolicyAction2["KEEP_AND_USE_RESOURCE_URL_POLICY"] = 5] = "KEEP_AND_USE_RESOURCE_URL_POLICY";
  AttributePolicyAction2[AttributePolicyAction2["KEEP_AND_USE_RESOURCE_URL_POLICY_FOR_SRCSET"] = 6] = "KEEP_AND_USE_RESOURCE_URL_POLICY_FOR_SRCSET";
})(AttributePolicyAction || (AttributePolicyAction = {}));
var FORBIDDEN_CUSTOM_ELEMENT_NAMES = /* @__PURE__ */ new Set(["ANNOTATION-XML", "COLOR-PROFILE", "FONT-FACE", "FONT-FACE-SRC", "FONT-FACE-URI", "FONT-FACE-FORMAT", "FONT-FACE-NAME", "MISSING-GLYPH"]);
function isCustomElement(tag) {
  return !FORBIDDEN_CUSTOM_ELEMENT_NAMES.has(tag.toUpperCase()) && /^[a-z][-_.a-z0-9]*-[-_.a-z0-9]*$/i.test(tag);
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/sanitizer_table/default_sanitizer_table.js
var ALLOWED_ELEMENTS = ["ARTICLE", "SECTION", "NAV", "ASIDE", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "FOOTER", "ADDRESS", "P", "HR", "PRE", "BLOCKQUOTE", "OL", "UL", "LH", "LI", "DL", "DT", "DD", "FIGURE", "FIGCAPTION", "MAIN", "DIV", "EM", "STRONG", "SMALL", "S", "CITE", "Q", "DFN", "ABBR", "RUBY", "RB", "RT", "RTC", "RP", "DATA", "TIME", "CODE", "VAR", "SAMP", "KBD", "SUB", "SUP", "I", "B", "U", "MARK", "BDI", "BDO", "SPAN", "BR", "WBR", "NOBR", "INS", "DEL", "PICTURE", "PARAM", "TRACK", "MAP", "TABLE", "CAPTION", "COLGROUP", "COL", "TBODY", "THEAD", "TFOOT", "TR", "TD", "TH", "SELECT", "DATALIST", "OPTGROUP", "OPTION", "OUTPUT", "PROGRESS", "METER", "FIELDSET", "LEGEND", "DETAILS", "SUMMARY", "MENU", "DIALOG", "SLOT", "CANVAS", "FONT", "CENTER", "ACRONYM", "BASEFONT", "BIG", "DIR", "HGROUP", "STRIKE", "TT"];
var ELEMENT_POLICIES = [["A", /* @__PURE__ */ new Map([["href", {
  policyAction: AttributePolicyAction.KEEP_AND_SANITIZE_URL
}]])], ["AREA", /* @__PURE__ */ new Map([["href", {
  policyAction: AttributePolicyAction.KEEP_AND_SANITIZE_URL
}]])], ["LINK", /* @__PURE__ */ new Map([["href", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY,
  conditions: /* @__PURE__ */ new Map([["rel", /* @__PURE__ */ new Set(["alternate", "author", "bookmark", "canonical", "cite", "help", "icon", "license", "next", "prefetch", "dns-prefetch", "prerender", "preconnect", "preload", "prev", "search", "subresource"])]])
}]])], ["SOURCE", /* @__PURE__ */ new Map([["src", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY
}], ["srcset", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY_FOR_SRCSET
}]])], ["IMG", /* @__PURE__ */ new Map([["src", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY
}], ["srcset", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY_FOR_SRCSET
}]])], ["VIDEO", /* @__PURE__ */ new Map([["src", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY
}]])], ["AUDIO", /* @__PURE__ */ new Map([["src", {
  policyAction: AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY
}]])]];
var ALLOWED_GLOBAL_ATTRIBUTES = ["title", "aria-atomic", "aria-autocomplete", "aria-busy", "aria-checked", "aria-current", "aria-disabled", "aria-dropeffect", "aria-expanded", "aria-haspopup", "aria-hidden", "aria-invalid", "aria-label", "aria-level", "aria-live", "aria-multiline", "aria-multiselectable", "aria-orientation", "aria-posinset", "aria-pressed", "aria-readonly", "aria-relevant", "aria-required", "aria-selected", "aria-setsize", "aria-sort", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "alt", "align", "autocapitalize", "autocomplete", "autocorrect", "autofocus", "autoplay", "bgcolor", "border", "cellpadding", "cellspacing", "checked", "cite", "color", "cols", "colspan", "controls", "controlslist", "datetime", "disabled", "download", "draggable", "enctype", "face", "formenctype", "frameborder", "height", "hreflang", "hidden", "ismap", "label", "lang", "loop", "max", "maxlength", "media", "minlength", "min", "multiple", "muted", "nonce", "open", "placeholder", "poster", "preload", "rel", "required", "reversed", "role", "rows", "rowspan", "selected", "shape", "size", "sizes", "slot", "span", "spellcheck", "start", "step", "summary", "translate", "type", "valign", "value", "width", "wrap", "itemscope", "itemtype", "itemid", "itemprop", "itemref"];
var GLOBAL_ATTRIBUTE_POLICIES = [["dir", {
  policyAction: AttributePolicyAction.KEEP_AND_NORMALIZE,
  conditions: pure(() => {
    return /* @__PURE__ */ new Map([["dir", /* @__PURE__ */ new Set(["auto", "ltr", "rtl"])]]);
  })
}], ["async", {
  policyAction: AttributePolicyAction.KEEP_AND_NORMALIZE,
  conditions: pure(() => {
    return /* @__PURE__ */ new Map([["async", /* @__PURE__ */ new Set(["async"])]]);
  })
}], ["loading", {
  policyAction: AttributePolicyAction.KEEP_AND_NORMALIZE,
  conditions: pure(() => {
    return /* @__PURE__ */ new Map([["loading", /* @__PURE__ */ new Set(["eager", "lazy"])]]);
  })
}], ["target", {
  policyAction: AttributePolicyAction.KEEP_AND_NORMALIZE,
  conditions: pure(() => {
    return /* @__PURE__ */ new Map([["target", /* @__PURE__ */ new Set(["_self", "_blank"])]]);
  })
}]];
var DEFAULT_SANITIZER_TABLE = new SanitizerTable(new Set(ALLOWED_ELEMENTS), new Map(ELEMENT_POLICIES), new Set(ALLOWED_GLOBAL_ATTRIBUTES), new Map(GLOBAL_ATTRIBUTE_POLICIES), void 0);

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/html_sanitizer.js
var HtmlSanitizerImpl = class {
  constructor(sanitizerTable, token, styleElementSanitizer, styleAttributeSanitizer, resourceUrlPolicy, openShadow) {
    this.sanitizerTable = sanitizerTable;
    this.styleElementSanitizer = styleElementSanitizer;
    this.styleAttributeSanitizer = styleAttributeSanitizer;
    this.resourceUrlPolicy = resourceUrlPolicy;
    this.openShadow = openShadow;
    this.changes = [];
    ensureTokenIsValid(token);
  }
  sanitizeAssertUnchanged(html) {
    if (true) {
      this.changes = [];
    }
    const sanitizedHtml = this.sanitize(html);
    if (this.changes.length !== 0) {
      throw new Error(`Unexpected change to HTML value as a result of sanitization. Input: "${html}", sanitized output: "${sanitizedHtml}"
List of changes:${this.changes.join("\n")}`);
    }
    return sanitizedHtml;
  }
  sanitize(html) {
    const inertDocument = document.implementation.createHTMLDocument("");
    return nodeToHtmlInternal(this.sanitizeToFragmentInternal(html, inertDocument), inertDocument.body);
  }
  sanitizeToFragment(html) {
    const inertDocument = document.implementation.createHTMLDocument("");
    if (this.styleElementSanitizer && this.styleAttributeSanitizer) {
      return this.sanitizeWithCssToFragment(html, inertDocument);
    }
    return this.sanitizeToFragmentInternal(html, inertDocument);
  }
  sanitizeWithCssToFragment(htmlWithCss, inertDocument) {
    const elem = document.createElement("safevalues-with-css");
    const mode = this.openShadow ? "open" : "closed";
    const shadow = elem.attachShadow({
      mode
    });
    const sanitized = this.sanitizeToFragmentInternal(htmlWithCss, inertDocument);
    const internalStyle = document.createElement("style");
    internalStyle.textContent = CSS_ISOLATION_STYLESHEET;
    internalStyle.id = "safevalues-internal-style";
    shadow.appendChild(internalStyle);
    shadow.appendChild(sanitized);
    const fragment = inertDocument.createDocumentFragment();
    fragment.appendChild(elem);
    return fragment;
  }
  sanitizeToFragmentInternal(html, inertDocument) {
    const dirtyFragment = createInertFragment(html, inertDocument);
    const treeWalker = document.createTreeWalker(dirtyFragment, 5, (n) => this.nodeFilter(n));
    let currentNode = treeWalker.nextNode();
    const sanitizedFragment = inertDocument.createDocumentFragment();
    let sanitizedParent = sanitizedFragment;
    while (currentNode !== null) {
      let sanitizedNode;
      if (isText(currentNode)) {
        if (this.styleElementSanitizer && sanitizedParent.nodeName === "STYLE") {
          const sanitizedCss = this.styleElementSanitizer(currentNode.data);
          sanitizedNode = this.createTextNode(sanitizedCss);
        } else {
          sanitizedNode = this.sanitizeTextNode(currentNode);
        }
      } else if (isElement(currentNode)) {
        sanitizedNode = this.sanitizeElementNode(currentNode, inertDocument);
      } else {
        let message = "";
        if (true) {
          message = "Node is not of type text or element";
        }
        throw new Error(message);
      }
      sanitizedParent.appendChild(sanitizedNode);
      currentNode = treeWalker.firstChild();
      if (currentNode) {
        sanitizedParent = sanitizedNode;
      } else {
        while (!(currentNode = treeWalker.nextSibling())) {
          if (!(currentNode = treeWalker.parentNode())) {
            break;
          }
          sanitizedParent = sanitizedParent.parentNode;
        }
      }
    }
    return sanitizedFragment;
  }
  createTextNode(text) {
    return document.createTextNode(text);
  }
  sanitizeTextNode(textNode) {
    return this.createTextNode(textNode.data);
  }
  sanitizeElementNode(elementNode, inertDocument) {
    const elementName = getNodeName(elementNode);
    const newNode = inertDocument.createElement(elementName);
    const dirtyAttributes = elementNode.attributes;
    for (const {
      name,
      value
    } of dirtyAttributes) {
      const policy2 = this.sanitizerTable.getAttributePolicy(name, elementName);
      if (!this.satisfiesAllConditions(policy2.conditions, dirtyAttributes)) {
        this.recordChange(`Not all conditions satisfied for attribute: ${name}.`);
        continue;
      }
      switch (policy2.policyAction) {
        case AttributePolicyAction.KEEP:
          setAttribute(newNode, name, value);
          break;
        case AttributePolicyAction.KEEP_AND_SANITIZE_URL:
          const sanitizedAttrUrl = restrictivelySanitizeUrl(value);
          if (sanitizedAttrUrl !== value) {
            this.recordChange(`Url in attribute ${name} was modified during sanitization. Original url:"${value}" was sanitized to: "${sanitizedAttrUrl}"`);
          }
          setAttribute(newNode, name, sanitizedAttrUrl);
          break;
        case AttributePolicyAction.KEEP_AND_NORMALIZE:
          setAttribute(newNode, name, value.toLowerCase());
          break;
        case AttributePolicyAction.KEEP_AND_SANITIZE_STYLE:
          if (this.styleAttributeSanitizer) {
            const sanitizedCss = this.styleAttributeSanitizer(value);
            setAttribute(newNode, name, sanitizedCss);
          } else {
            setAttribute(newNode, name, value);
          }
          break;
        case AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY:
          if (this.resourceUrlPolicy) {
            const hints = {
              type: ResourceUrlPolicyHintsType.HTML_ATTRIBUTE,
              attributeName: name,
              elementName
            };
            const url = parseUrl(value);
            const sanitizedUrl = this.resourceUrlPolicy(url, hints);
            if (sanitizedUrl) {
              setAttribute(newNode, name, sanitizedUrl.toString());
            }
          } else {
            setAttribute(newNode, name, value);
          }
          break;
        case AttributePolicyAction.KEEP_AND_USE_RESOURCE_URL_POLICY_FOR_SRCSET:
          if (this.resourceUrlPolicy) {
            const hints = {
              type: ResourceUrlPolicyHintsType.HTML_ATTRIBUTE,
              attributeName: name,
              elementName
            };
            const srcset = parseSrcset(value);
            const sanitizedSrcset = {
              parts: []
            };
            for (const part of srcset.parts) {
              const url = parseUrl(part.url);
              const sanitizedUrl = this.resourceUrlPolicy(url, hints);
              if (sanitizedUrl) {
                sanitizedSrcset.parts.push({
                  url: sanitizedUrl.toString(),
                  descriptor: part.descriptor
                });
              }
            }
            setAttribute(newNode, name, serializeSrcset(sanitizedSrcset));
          } else {
            setAttribute(newNode, name, value);
          }
          break;
        case AttributePolicyAction.DROP:
          this.recordChange(`Attribute: ${name} was dropped`);
          break;
        default:
          if (true) {
            checkExhaustive2(policy2.policyAction, "Unhandled AttributePolicyAction case");
          }
      }
    }
    return newNode;
  }
  nodeFilter(node) {
    if (isText(node)) {
      return 1;
    } else if (!isElement(node)) {
      return 2;
    }
    const nodeName = getNodeName(node);
    if (nodeName === null) {
      this.recordChange(`Node name was null for node: ${node}`);
      return 2;
    }
    if (this.sanitizerTable.isAllowedElement(nodeName)) {
      return 1;
    }
    this.recordChange(`Element: ${nodeName} was dropped`);
    return 2;
  }
  recordChange(errorMessage) {
    if (true) {
      this.changes.push(errorMessage);
    }
  }
  satisfiesAllConditions(conditions, attrs) {
    var _a;
    if (!conditions) {
      return true;
    }
    for (const [attrName, expectedValues] of conditions) {
      const value = (_a = attrs.getNamedItem(attrName)) === null || _a === void 0 ? void 0 : _a.value;
      if (value && !expectedValues.has(value)) {
        return false;
      }
    }
    return true;
  }
};
function setAttribute(el, name, value) {
  el.setAttribute(name, value);
}
function parseSrcset(srcset) {
  const parts = [];
  for (const part of srcset.split(",")) {
    const [url, descriptor] = part.trim().split(/\s+/, 2);
    parts.push({
      url,
      descriptor
    });
  }
  return {
    parts
  };
}
function serializeSrcset(srcset) {
  return srcset.parts.map((part) => {
    const {
      url,
      descriptor
    } = part;
    return `${url}${descriptor ? ` ${descriptor}` : ""}`;
  }).join(" , ");
}
var defaultHtmlSanitizer = pure(() => new HtmlSanitizerImpl(DEFAULT_SANITIZER_TABLE, secretToken));
function checkExhaustive2(value, msg = `unexpected value ${value}!`) {
  throw new Error(msg);
}

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/html_sanitizer_builder.js
var BaseSanitizerBuilder = class {
  constructor() {
    this.calledBuild = false;
    this.sanitizerTable = DEFAULT_SANITIZER_TABLE;
  }
  /** Builder option to restrict allowed elements to a smaller subset. */
  onlyAllowElements(elementSet) {
    const allowedElements = /* @__PURE__ */ new Set();
    const allowedElementPolicies = /* @__PURE__ */ new Map();
    for (let element of elementSet) {
      element = element.toUpperCase();
      if (!this.sanitizerTable.isAllowedElement(element)) {
        throw new Error(`Element: ${element}, is not allowed by html5_contract.textpb`);
      }
      const elementPolicy = this.sanitizerTable.elementPolicies.get(element);
      if (elementPolicy !== void 0) {
        allowedElementPolicies.set(element, elementPolicy);
      } else {
        allowedElements.add(element);
      }
    }
    this.sanitizerTable = new SanitizerTable(allowedElements, allowedElementPolicies, this.sanitizerTable.allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Builder option to allow a set of custom elements. Must be called either
   * without or after `onlyAllowElements` - will be overwritten otherwise.
   * Custom elements must contain a dash.
   */
  allowCustomElement(element, allowedAttributes) {
    const allowedElements = new Set(this.sanitizerTable.allowedElements);
    const allowedElementPolicies = new Map(this.sanitizerTable.elementPolicies);
    element = element.toUpperCase();
    if (!isCustomElement(element)) {
      throw new Error(`Element: ${element} is not a custom element`);
    }
    if (allowedAttributes) {
      const elementPolicy = /* @__PURE__ */ new Map();
      for (const attribute of allowedAttributes) {
        elementPolicy.set(attribute.toLowerCase(), {
          policyAction: AttributePolicyAction.KEEP
        });
      }
      allowedElementPolicies.set(element, elementPolicy);
    } else {
      allowedElements.add(element);
    }
    this.sanitizerTable = new SanitizerTable(allowedElements, allowedElementPolicies, this.sanitizerTable.allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Builder option to restrict allowed attributes to a smaller subset.
   *
   * If the attribute isn't currently allowed then it won't be added.
   */
  onlyAllowAttributes(attributeSet) {
    const allowedGlobalAttributes = /* @__PURE__ */ new Set();
    const globalAttributePolicies = /* @__PURE__ */ new Map();
    const elementPolicies = /* @__PURE__ */ new Map();
    for (const attribute of attributeSet) {
      if (this.sanitizerTable.allowedGlobalAttributes.has(attribute)) {
        allowedGlobalAttributes.add(attribute);
      }
      if (this.sanitizerTable.globalAttributePolicies.has(attribute)) {
        globalAttributePolicies.set(attribute, this.sanitizerTable.globalAttributePolicies.get(attribute));
      }
    }
    for (const [elementName, originalElementPolicy] of this.sanitizerTable.elementPolicies.entries()) {
      const newElementPolicy = /* @__PURE__ */ new Map();
      for (const [attribute, attributePolicy] of originalElementPolicy.entries()) {
        if (attributeSet.has(attribute)) {
          newElementPolicy.set(attribute, attributePolicy);
        }
      }
      elementPolicies.set(elementName, newElementPolicy);
    }
    this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, elementPolicies, allowedGlobalAttributes, globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Allows all or a definite set of data attributes passed.
   *
   * When called without arguments, all data attributes are allowed.
   * When a set of attributes is passed, its values must be prefixed with "data-"
   *
   * If called with onlyAllowElements or onlyAllowAttributes, those methods must
   * be called first.
   */
  allowDataAttributes(attributes) {
    if (attributes === void 0) {
      const globallyAllowedAttributePrefixes = new Set(this.sanitizerTable.globallyAllowedAttributePrefixes);
      globallyAllowedAttributePrefixes.add("data-");
      this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, this.sanitizerTable.elementPolicies, this.sanitizerTable.allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, globallyAllowedAttributePrefixes);
      return this;
    }
    const allowedGlobalAttributes = new Set(this.sanitizerTable.allowedGlobalAttributes);
    for (const attribute of attributes) {
      if (attribute.indexOf("data-") !== 0) {
        throw new Error(`data attribute: ${attribute} does not begin with the prefix "data-"`);
      }
      allowedGlobalAttributes.add(attribute);
    }
    this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, this.sanitizerTable.elementPolicies, allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Preserves style attributes. Note that the sanitizer won't parse and
   * sanitize the values but keep them as they are. In particular this means
   * that the code will be able to call functions that could do undesirable
   * things (e.g. `url` to trigger a network request), as well as any custom
   * properties or functions defined by the application.
   */
  allowStyleAttributes() {
    const globalAttributePolicies = new Map(this.sanitizerTable.globalAttributePolicies);
    globalAttributePolicies.set("style", {
      policyAction: AttributePolicyAction.KEEP_AND_SANITIZE_STYLE
    });
    this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, this.sanitizerTable.elementPolicies, this.sanitizerTable.allowedGlobalAttributes, globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Preserves the class attribute on all elements. This means contents can
   * adopt CSS styles from other page elements and possibly mask themselves as
   * legitimate UI elements, which can lead to phishing.
   */
  allowClassAttributes() {
    const allowedGlobalAttributes = new Set(this.sanitizerTable.allowedGlobalAttributes);
    allowedGlobalAttributes.add("class");
    this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, this.sanitizerTable.elementPolicies, allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Preserves id attributes. This carries moderate risk as it allows an
   * element to override other elements with the same ID.
   */
  allowIdAttributes() {
    const allowedGlobalAttributes = new Set(this.sanitizerTable.allowedGlobalAttributes);
    allowedGlobalAttributes.add("id");
    this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, this.sanitizerTable.elementPolicies, allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Preserves (some) attributes that reference existing ids. This carries a
   * moderate security risk, because sanitized content can create semantic
   * associations with existing elements in the page, regardless of the layout.
   * This could be used to override the label associated with a form input by a
   * screen reader, and facilitate phishing.
   */
  allowIdReferenceAttributes() {
    const allowedGlobalAttributes = new Set(this.sanitizerTable.allowedGlobalAttributes);
    allowedGlobalAttributes.add("aria-activedescendant").add("aria-controls").add("aria-labelledby").add("aria-owns").add("for").add("list");
    this.sanitizerTable = new SanitizerTable(this.sanitizerTable.allowedElements, this.sanitizerTable.elementPolicies, allowedGlobalAttributes, this.sanitizerTable.globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
    return this;
  }
  /**
   * Sets the ResourceUrlPolicy to be used by the sanitizer.
   *
   * The ResourceUrlPolicy can be used to decide whether a given URL is allowed
   * to be loaded as an external resource. It is a function that an instance
   * of `URL` and a set of hints giving a context on why an image was loaded.
   *
   * The policy can return `null` to indicate that the resource should be
   * dropped, otherwise it should return a valid `URL` that will be used to
   * replace the original URL in the sanitized output.
   *
   * For example the following policy drops all images loaded from
   * `https://forbidden.google.com` but allows all other images.
   *
   * ```typescript
   * const resourceUrlPolicy: ResourceUrlPolicy = (url) => {
   *   if (url.origin === 'https://forbidden.google.com') {
   *     return null;
   *   }
   *   return url;
   * };
   * ```
   *
   * You can also use the `ResourceUrlPolicyHints` to make the policy more
   * informed. For example the following policy only allows images loaded
   * via an <img src> element but drops all other images.
   *
   * ```typescript
   * const resourceUrlPolicy: ResourceUrlPolicy = (url, hints) => {
   *   if (hints.type === ResourceUrlPolicyHintsType.HTML_ATTRIBUTE &&
   *       hints.attributeName === 'src' &&
   *       hints.elementName === 'IMG') {
   *     return url;
   *   }
   *   return null;
   * };
   * ```
   */
  withResourceUrlPolicy(resourceUrlPolicy) {
    this.resourceUrlPolicy = resourceUrlPolicy;
    return this;
  }
};
var CssSanitizerBuilder = class extends BaseSanitizerBuilder {
  constructor() {
    super(...arguments);
    this.animationsAllowed = false;
    this.transitionsAllowed = false;
    this.openShadow = false;
  }
  allowAnimations() {
    this.animationsAllowed = true;
    return this;
  }
  allowTransitions() {
    this.transitionsAllowed = true;
    return this;
  }
  /**
   * Sets the shadow DOM mode to 'open'.
   *
   * While this method is not formally restricted, it can potentially be used to
   * bypass the security guarantees of the CSS sanitizer. If you need open
   * shadow DOM, please contact ise-web-members@ to discuss your use case.
   */
  withOpenShadow() {
    this.openShadow = true;
    return this;
  }
  /**
   * Builds a CSS sanitizer.
   *
   * Note that this function always adds `style`, `id`, `name` and `class`
   * attributes to the allowlist as well as the `STYLE` element.
   */
  build() {
    this.extendSanitizerTableForCss();
    const propertyDiscarders = [];
    if (!this.animationsAllowed) {
      propertyDiscarders.push((property) => /^(animation|offset)(-|$)/.test(property));
    }
    if (!this.transitionsAllowed) {
      propertyDiscarders.push((property) => /^transition(-|$)/.test(property));
    }
    const styleElementSanitizer = (cssText) => sanitizeStyleElement(cssText, CSS_PROPERTY_ALLOWLIST, CSS_FUNCTION_ALLOWLIST, this.resourceUrlPolicy, this.animationsAllowed, propertyDiscarders);
    const styleAttributeSanitizer = (cssText) => sanitizeStyleAttribute(cssText, CSS_PROPERTY_ALLOWLIST, CSS_FUNCTION_ALLOWLIST, this.resourceUrlPolicy, propertyDiscarders);
    return new HtmlSanitizerImpl(this.sanitizerTable, secretToken, styleElementSanitizer, styleAttributeSanitizer, this.resourceUrlPolicy, this.openShadow);
  }
  extendSanitizerTableForCss() {
    const allowedElements = new Set(this.sanitizerTable.allowedElements);
    const allowedGlobalAttributes = new Set(this.sanitizerTable.allowedGlobalAttributes);
    const globalAttributePolicies = new Map(this.sanitizerTable.globalAttributePolicies);
    allowedElements.add("STYLE");
    globalAttributePolicies.set("style", {
      policyAction: AttributePolicyAction.KEEP_AND_SANITIZE_STYLE
    });
    allowedGlobalAttributes.add("id");
    allowedGlobalAttributes.add("name");
    allowedGlobalAttributes.add("class");
    this.sanitizerTable = new SanitizerTable(allowedElements, this.sanitizerTable.elementPolicies, allowedGlobalAttributes, globalAttributePolicies, this.sanitizerTable.globallyAllowedAttributePrefixes);
  }
};

// node_modules/safevalues/dist/mjs/builders/html_sanitizer/default_css_sanitizer.js
var defaultCssSanitizer = pure(() => new CssSanitizerBuilder().build());

// node_modules/safevalues/dist/mjs/builders/resource_url_builders.js
function hasValidOrigin(base) {
  if (!(/^https:\/\//.test(base) || /^\/\//.test(base))) {
    return false;
  }
  const originStart = base.indexOf("//") + 2;
  const originEnd = base.indexOf("/", originStart);
  if (originEnd <= originStart) {
    throw new Error(`Can't interpolate data in a url's origin, Please make sure to fully specify the origin, terminated with '/'.`);
  }
  const origin = base.substring(originStart, originEnd);
  if (!/^[0-9a-z.:-]+$/i.test(origin)) {
    throw new Error("The origin contains unsupported characters.");
  }
  if (!/^[^:]*(:[0-9]+)?$/i.test(origin)) {
    throw new Error("Invalid port number.");
  }
  if (!/(^|\.)[a-z][^.]*$/i.test(origin)) {
    throw new Error("The top-level domain must start with a letter.");
  }
  return true;
}
function isValidAboutUrl(base) {
  if (!/^about:blank/.test(base)) {
    return false;
  }
  if (base !== "about:blank" && !/^about:blank#/.test(base)) {
    throw new Error("The about url is invalid.");
  }
  return true;
}
function isValidPathStart(base) {
  if (!/^\//.test(base)) {
    return false;
  }
  if (base === "/" || base.length > 1 && base[1] !== "/" && base[1] !== "\\") {
    return true;
  }
  throw new Error("The path start in the url is invalid.");
}
function isValidRelativePathStart(base) {
  return new RegExp("^[^:\\s\\\\/]+/").test(base);
}
function trustedResourceUrl(templateObj, ...rest) {
  if (true) {
    assertIsTemplateObject(templateObj, rest.length);
  }
  if (rest.length === 0) {
    return createResourceUrlInternal(templateObj[0]);
  }
  const base = templateObj[0].toLowerCase();
  if (true) {
    if (/^data:/.test(base)) {
      throw new Error("Data URLs cannot have expressions in the template literal input.");
    }
    if (!hasValidOrigin(base) && !isValidPathStart(base) && !isValidRelativePathStart(base) && !isValidAboutUrl(base)) {
      throw new Error("Trying to interpolate expressions in an unsupported url format.");
    }
  }
  let url = templateObj[0];
  for (let i = 0; i < rest.length; i++) {
    url += encodeURIComponent(rest[i]) + templateObj[i + 1];
  }
  return createResourceUrlInternal(url);
}

// node_modules/safevalues/dist/mjs/dom/globals/window.js
function getScriptNonce(doc) {
  return getNonceFor("script", doc);
}
function getNonceFor(elementName, doc = document) {
  var _a;
  const el = (_a = doc.querySelector) === null || _a === void 0 ? void 0 : _a.call(doc, `${elementName}[nonce]`);
  if (el == null) {
    return "";
  }
  return el["nonce"] || el.getAttribute("nonce") || "";
}

// node_modules/safevalues/dist/mjs/dom/elements/script.js
function setNonceForScriptElement(script) {
  const nonce = getScriptNonce(script.ownerDocument);
  if (nonce) {
    script.setAttribute("nonce", nonce);
  }
}
function setScriptSrc(script, v, options) {
  script.src = unwrapResourceUrl(v);
  if (options === null || options === void 0 ? void 0 : options.omitNonce) return;
  setNonceForScriptElement(script);
}

// node_modules/@angular/youtube-player/fesm2022/youtube-player.mjs
var _c0 = ["youtubeContainer"];
function YouTubePlayer_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "youtube-player-placeholder", 2);
    ɵɵlistener("click", function YouTubePlayer_Conditional_0_Template_youtube_player_placeholder_click_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1._load(true));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("videoId", ctx_r1.videoId)("width", ctx_r1.width)("height", ctx_r1.height)("isLoading", ctx_r1._isLoading)("buttonLabel", ctx_r1.placeholderButtonLabel)("quality", ctx_r1.placeholderImageQuality);
  }
}
var YouTubePlayerPlaceholder = class _YouTubePlayerPlaceholder {
  /** ID of the video for which to show the placeholder. */
  videoId;
  /** Width of the video for which to show the placeholder. */
  width;
  /** Height of the video for which to show the placeholder. */
  height;
  /** Whether the video is currently being loaded. */
  isLoading;
  /** Accessible label for the play button. */
  buttonLabel;
  /** Quality of the placeholder image. */
  quality;
  /** Gets the background image showing the placeholder. */
  _getBackgroundImage() {
    let url;
    if (this.quality === "low") {
      url = `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
    } else if (this.quality === "high") {
      url = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
    } else {
      url = `https://i.ytimg.com/vi_webp/${this.videoId}/sddefault.webp`;
    }
    return `url(${url})`;
  }
  static ɵfac = function YouTubePlayerPlaceholder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _YouTubePlayerPlaceholder)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _YouTubePlayerPlaceholder,
    selectors: [["youtube-player-placeholder"]],
    hostAttrs: [1, "youtube-player-placeholder"],
    hostVars: 8,
    hostBindings: function YouTubePlayerPlaceholder_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleProp("background-image", ctx._getBackgroundImage())("width", ctx.width, "px")("height", ctx.height, "px");
        ɵɵclassProp("youtube-player-placeholder-loading", ctx.isLoading);
      }
    },
    inputs: {
      videoId: "videoId",
      width: "width",
      height: "height",
      isLoading: "isLoading",
      buttonLabel: "buttonLabel",
      quality: "quality"
    },
    decls: 4,
    vars: 1,
    consts: [["type", "button", 1, "youtube-player-placeholder-button"], ["height", "100%", "version", "1.1", "viewBox", "0 0 68 48", "focusable", "false", "aria-hidden", "true"], ["d", "M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z", "fill", "#f00"], ["d", "M 45,24 27,14 27,34", "fill", "#fff"]],
    template: function YouTubePlayerPlaceholder_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "button", 0);
        ɵɵnamespaceSVG();
        ɵɵelementStart(1, "svg", 1);
        ɵɵelement(2, "path", 2)(3, "path", 3);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵattribute("aria-label", ctx.buttonLabel);
      }
    },
    styles: [".youtube-player-placeholder{display:flex;align-items:center;justify-content:center;width:100%;overflow:hidden;cursor:pointer;background-color:#000;background-position:center center;background-size:cover;transition:box-shadow 300ms ease;box-shadow:inset 0 120px 90px -90px rgba(0,0,0,.8)}:fullscreen .youtube-player-placeholder{min-width:100vw;min-height:100vh}.youtube-player-placeholder-button{transition:opacity 300ms ease;-moz-appearance:none;-webkit-appearance:none;background:none;border:none;padding:0;display:flex}.youtube-player-placeholder-button svg{width:68px;height:48px}.youtube-player-placeholder-loading{box-shadow:none}.youtube-player-placeholder-loading .youtube-player-placeholder-button{opacity:0}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(YouTubePlayerPlaceholder, [{
    type: Component,
    args: [{
      selector: "youtube-player-placeholder",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
    <button type="button" class="youtube-player-placeholder-button" [attr.aria-label]="buttonLabel">
      <svg
        height="100%"
        version="1.1"
        viewBox="0 0 68 48"
        focusable="false"
        aria-hidden="true">
        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
      </svg>
    </button>
  `,
      host: {
        "class": "youtube-player-placeholder",
        "[class.youtube-player-placeholder-loading]": "isLoading",
        "[style.background-image]": "_getBackgroundImage()",
        "[style.width.px]": "width",
        "[style.height.px]": "height"
      },
      styles: [".youtube-player-placeholder{display:flex;align-items:center;justify-content:center;width:100%;overflow:hidden;cursor:pointer;background-color:#000;background-position:center center;background-size:cover;transition:box-shadow 300ms ease;box-shadow:inset 0 120px 90px -90px rgba(0,0,0,.8)}:fullscreen .youtube-player-placeholder{min-width:100vw;min-height:100vh}.youtube-player-placeholder-button{transition:opacity 300ms ease;-moz-appearance:none;-webkit-appearance:none;background:none;border:none;padding:0;display:flex}.youtube-player-placeholder-button svg{width:68px;height:48px}.youtube-player-placeholder-loading{box-shadow:none}.youtube-player-placeholder-loading .youtube-player-placeholder-button{opacity:0}\n"]
    }]
  }], null, {
    videoId: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    isLoading: [{
      type: Input
    }],
    buttonLabel: [{
      type: Input
    }],
    quality: [{
      type: Input
    }]
  });
})();
var YOUTUBE_PLAYER_CONFIG = new InjectionToken("YOUTUBE_PLAYER_CONFIG");
var DEFAULT_PLAYER_WIDTH = 640;
var DEFAULT_PLAYER_HEIGHT = 390;
function coerceTime(value) {
  return value == null ? value : numberAttribute(value, 0);
}
var PlayerState;
(function(PlayerState2) {
  PlayerState2[PlayerState2["UNSTARTED"] = -1] = "UNSTARTED";
  PlayerState2[PlayerState2["ENDED"] = 0] = "ENDED";
  PlayerState2[PlayerState2["PLAYING"] = 1] = "PLAYING";
  PlayerState2[PlayerState2["PAUSED"] = 2] = "PAUSED";
  PlayerState2[PlayerState2["BUFFERING"] = 3] = "BUFFERING";
  PlayerState2[PlayerState2["CUED"] = 5] = "CUED";
})(PlayerState || (PlayerState = {}));
var YouTubePlayer = class _YouTubePlayer {
  _ngZone = inject(NgZone);
  _nonce = inject(CSP_NONCE, {
    optional: true
  });
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  _player;
  _pendingPlayer;
  _existingApiReadyCallback;
  _pendingPlayerState;
  _destroyed = new Subject();
  _playerChanges = new BehaviorSubject(void 0);
  _isLoading = false;
  _hasPlaceholder = true;
  /** Whether we're currently rendering inside a browser. */
  _isBrowser;
  /** YouTube Video ID to view */
  videoId;
  /** Height of video player */
  get height() {
    return this._height;
  }
  set height(height) {
    this._height = height == null || isNaN(height) ? DEFAULT_PLAYER_HEIGHT : height;
  }
  _height = DEFAULT_PLAYER_HEIGHT;
  /** Width of video player */
  get width() {
    return this._width;
  }
  set width(width) {
    this._width = width == null || isNaN(width) ? DEFAULT_PLAYER_WIDTH : width;
  }
  _width = DEFAULT_PLAYER_WIDTH;
  /** The moment when the player is supposed to start playing */
  startSeconds;
  /** The moment when the player is supposed to stop playing */
  endSeconds;
  /** The suggested quality of the player */
  suggestedQuality;
  /**
   * Extra parameters used to configure the player. See:
   * https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5#Parameters
   */
  playerVars;
  /** Whether cookies inside the player have been disabled. */
  disableCookies = false;
  /** Whether to automatically load the YouTube iframe API. Defaults to `true`. */
  loadApi;
  /**
   * By default the player shows a placeholder image instead of loading the YouTube API which
   * improves the initial page load performance. This input allows for the behavior to be disabled.
   */
  disablePlaceholder = false;
  /**
   * Whether the iframe will attempt to load regardless of the status of the api on the
   * page. Set this to true if you don't want the `onYouTubeIframeAPIReady` field to be
   * set on the global window.
   */
  showBeforeIframeApiLoads = false;
  /** Accessible label for the play button inside of the placeholder. */
  placeholderButtonLabel;
  /**
   * Quality of the displayed placeholder image. Defaults to `standard`,
   * because not all video have a high-quality placeholder.
   */
  placeholderImageQuality;
  // Note: ready event can't go through the lazy emitter, because it
  // happens before the `_playerChanges` stream emits the new player.
  /** Emits when the player is initialized. */
  ready = new EventEmitter();
  /** Emits when the state of the player has changed. */
  stateChange = this._getLazyEmitter("onStateChange");
  /** Emits when there's an error while initializing the player. */
  error = this._getLazyEmitter("onError");
  /** Emits when the underlying API of the player has changed. */
  apiChange = this._getLazyEmitter("onApiChange");
  /** Emits when the playback quality has changed. */
  playbackQualityChange = this._getLazyEmitter("onPlaybackQualityChange");
  /** Emits when the playback rate has changed. */
  playbackRateChange = this._getLazyEmitter("onPlaybackRateChange");
  /** The element that will be replaced by the iframe. */
  youtubeContainer;
  constructor() {
    const platformId = inject(PLATFORM_ID);
    const config = inject(YOUTUBE_PLAYER_CONFIG, {
      optional: true
    });
    this.loadApi = config?.loadApi ?? true;
    this.disablePlaceholder = !!config?.disablePlaceholder;
    this.placeholderButtonLabel = config?.placeholderButtonLabel || "Play video";
    this.placeholderImageQuality = config?.placeholderImageQuality || "standard";
    this._isBrowser = isPlatformBrowser(platformId);
  }
  ngAfterViewInit() {
    this._conditionallyLoad();
  }
  ngOnChanges(changes) {
    if (this._shouldRecreatePlayer(changes)) {
      this._conditionallyLoad();
    } else if (this._player) {
      if (changes["width"] || changes["height"]) {
        this._setSize();
      }
      if (changes["suggestedQuality"]) {
        this._setQuality();
      }
      if (changes["startSeconds"] || changes["endSeconds"] || changes["suggestedQuality"]) {
        this._cuePlayer();
      }
    }
  }
  ngOnDestroy() {
    this._pendingPlayer?.destroy();
    if (this._player) {
      this._player.destroy();
      window.onYouTubeIframeAPIReady = this._existingApiReadyCallback;
    }
    this._playerChanges.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#playVideo */
  playVideo() {
    if (this._player) {
      this._player.playVideo();
    } else {
      this._getPendingState().playbackState = PlayerState.PLAYING;
      this._load(true);
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#pauseVideo */
  pauseVideo() {
    if (this._player) {
      this._player.pauseVideo();
    } else {
      this._getPendingState().playbackState = PlayerState.PAUSED;
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#stopVideo */
  stopVideo() {
    if (this._player) {
      this._player.stopVideo();
    } else {
      this._getPendingState().playbackState = PlayerState.CUED;
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#seekTo */
  seekTo(seconds, allowSeekAhead) {
    if (this._player) {
      this._player.seekTo(seconds, allowSeekAhead);
    } else {
      this._getPendingState().seek = {
        seconds,
        allowSeekAhead
      };
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#mute */
  mute() {
    if (this._player) {
      this._player.mute();
    } else {
      this._getPendingState().muted = true;
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#unMute */
  unMute() {
    if (this._player) {
      this._player.unMute();
    } else {
      this._getPendingState().muted = false;
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#isMuted */
  isMuted() {
    if (this._player) {
      return this._player.isMuted();
    }
    if (this._pendingPlayerState) {
      return !!this._pendingPlayerState.muted;
    }
    return false;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#setVolume */
  setVolume(volume) {
    if (this._player) {
      this._player.setVolume(volume);
    } else {
      this._getPendingState().volume = volume;
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getVolume */
  getVolume() {
    if (this._player) {
      return this._player.getVolume();
    }
    if (this._pendingPlayerState && this._pendingPlayerState.volume != null) {
      return this._pendingPlayerState.volume;
    }
    return 0;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate */
  setPlaybackRate(playbackRate) {
    if (this._player) {
      return this._player.setPlaybackRate(playbackRate);
    } else {
      this._getPendingState().playbackRate = playbackRate;
    }
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getPlaybackRate */
  getPlaybackRate() {
    if (this._player) {
      return this._player.getPlaybackRate();
    }
    if (this._pendingPlayerState && this._pendingPlayerState.playbackRate != null) {
      return this._pendingPlayerState.playbackRate;
    }
    return 0;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getAvailablePlaybackRates */
  getAvailablePlaybackRates() {
    return this._player ? this._player.getAvailablePlaybackRates() : [];
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getVideoLoadedFraction */
  getVideoLoadedFraction() {
    return this._player ? this._player.getVideoLoadedFraction() : 0;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getPlayerState */
  getPlayerState() {
    if (!this._isBrowser || !window.YT) {
      return void 0;
    }
    if (this._player) {
      return this._player.getPlayerState();
    }
    if (this._pendingPlayerState && this._pendingPlayerState.playbackState != null) {
      return this._pendingPlayerState.playbackState;
    }
    return PlayerState.UNSTARTED;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getCurrentTime */
  getCurrentTime() {
    if (this._player) {
      return this._player.getCurrentTime();
    }
    if (this._pendingPlayerState && this._pendingPlayerState.seek) {
      return this._pendingPlayerState.seek.seconds;
    }
    return 0;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getPlaybackQuality */
  getPlaybackQuality() {
    return this._player ? this._player.getPlaybackQuality() : "default";
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getAvailableQualityLevels */
  getAvailableQualityLevels() {
    return this._player ? this._player.getAvailableQualityLevels() : [];
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getDuration */
  getDuration() {
    return this._player ? this._player.getDuration() : 0;
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getVideoUrl */
  getVideoUrl() {
    return this._player ? this._player.getVideoUrl() : "";
  }
  /** See https://developers.google.com/youtube/iframe_api_reference#getVideoEmbedCode */
  getVideoEmbedCode() {
    return this._player ? this._player.getVideoEmbedCode() : "";
  }
  /**
   * Attempts to put the player into fullscreen mode, depending on browser support.
   * @param options Options controlling how the element behaves in fullscreen mode.
   */
  requestFullscreen(options) {
    return __async(this, null, function* () {
      const element = this._elementRef.nativeElement;
      return element.requestFullscreen ? element.requestFullscreen(options) : Promise.reject(new Error("Fullscreen API not supported by browser."));
    });
  }
  /**
   * Loads the YouTube API and sets up the player.
   * @param playVideo Whether to automatically play the video once the player is loaded.
   */
  _load(playVideo) {
    if (!this._isBrowser) {
      return;
    }
    if (!window.YT || !window.YT.Player) {
      if (this.loadApi) {
        this._isLoading = true;
        loadApi(this._nonce);
      } else if (this.showBeforeIframeApiLoads && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw new Error("Namespace YT not found, cannot construct embedded youtube player. Please install the YouTube Player API Reference for iframe Embeds: https://developers.google.com/youtube/iframe_api_reference");
      }
      this._existingApiReadyCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        this._existingApiReadyCallback?.();
        this._ngZone.run(() => this._createPlayer(playVideo));
      };
    } else {
      this._createPlayer(playVideo);
    }
  }
  /** Loads the player depending on the internal state of the component. */
  _conditionallyLoad() {
    if (!this._shouldShowPlaceholder()) {
      this._load(false);
    } else if (this.playerVars?.autoplay === 1) {
      this._load(true);
    }
  }
  /** Whether to show the placeholder element. */
  _shouldShowPlaceholder() {
    if (this.disablePlaceholder) {
      return false;
    }
    if (!this._isBrowser) {
      return true;
    }
    return this._hasPlaceholder && !!this.videoId && !this._player;
  }
  /** Gets an object that should be used to store the temporary API state. */
  _getPendingState() {
    if (!this._pendingPlayerState) {
      this._pendingPlayerState = {};
    }
    return this._pendingPlayerState;
  }
  /**
   * Determines whether a change in the component state
   * requires the YouTube player to be recreated.
   */
  _shouldRecreatePlayer(changes) {
    const change = changes["videoId"] || changes["playerVars"] || changes["disableCookies"] || changes["disablePlaceholder"];
    return !!change && !change.isFirstChange();
  }
  /**
   * Creates a new YouTube player and destroys the existing one.
   * @param playVideo Whether to play the video once it loads.
   */
  _createPlayer(playVideo) {
    this._player?.destroy();
    this._pendingPlayer?.destroy();
    if (typeof YT === "undefined" || !this.videoId && !this.playerVars?.list) {
      return;
    }
    const params = {
      host: this.disableCookies ? "https://www.youtube-nocookie.com" : void 0,
      width: this.width,
      height: this.height,
      // Calling `playVideo` on load doesn't appear to actually play
      // the video so we need to trigger it through `playerVars` instead.
      playerVars: playVideo ? __spreadProps(__spreadValues({}, this.playerVars || {}), {
        autoplay: 1
      }) : this.playerVars
    };
    if (this.videoId) {
      params.videoId = this.videoId;
    }
    const player = this._ngZone.runOutsideAngular(() => new YT.Player(this.youtubeContainer.nativeElement, params));
    const whenReady = (event) => {
      this._ngZone.run(() => {
        this._isLoading = false;
        this._hasPlaceholder = false;
        this._player = player;
        this._pendingPlayer = void 0;
        player.removeEventListener("onReady", whenReady);
        this._playerChanges.next(player);
        this.ready.emit(event);
        this._setSize();
        this._setQuality();
        if (this._pendingPlayerState) {
          this._applyPendingPlayerState(player, this._pendingPlayerState);
          this._pendingPlayerState = void 0;
        }
        const state = player.getPlayerState();
        if (state === PlayerState.UNSTARTED || state === PlayerState.CUED || state == null) {
          this._cuePlayer();
        } else if (playVideo && this.startSeconds && this.startSeconds > 0) {
          player.seekTo(this.startSeconds, true);
        }
        this._changeDetectorRef.markForCheck();
      });
    };
    this._pendingPlayer = player;
    player.addEventListener("onReady", whenReady);
  }
  /** Applies any state that changed before the player was initialized. */
  _applyPendingPlayerState(player, pendingState) {
    const {
      playbackState,
      playbackRate,
      volume,
      muted,
      seek
    } = pendingState;
    switch (playbackState) {
      case PlayerState.PLAYING:
        player.playVideo();
        break;
      case PlayerState.PAUSED:
        player.pauseVideo();
        break;
      case PlayerState.CUED:
        player.stopVideo();
        break;
    }
    if (playbackRate != null) {
      player.setPlaybackRate(playbackRate);
    }
    if (volume != null) {
      player.setVolume(volume);
    }
    if (muted != null) {
      muted ? player.mute() : player.unMute();
    }
    if (seek != null) {
      player.seekTo(seek.seconds, seek.allowSeekAhead);
    }
  }
  /** Cues the player based on the current component state. */
  _cuePlayer() {
    if (this._player && this.videoId) {
      this._player.cueVideoById({
        videoId: this.videoId,
        startSeconds: this.startSeconds,
        endSeconds: this.endSeconds,
        suggestedQuality: this.suggestedQuality
      });
    }
  }
  /** Sets the player's size based on the current input values. */
  _setSize() {
    this._player?.setSize(this.width, this.height);
  }
  /** Sets the player's quality based on the current input values. */
  _setQuality() {
    if (this._player && this.suggestedQuality) {
      this._player.setPlaybackQuality(this.suggestedQuality);
    }
  }
  /** Gets an observable that adds an event listener to the player when a user subscribes to it. */
  _getLazyEmitter(name) {
    return this._playerChanges.pipe(
      // Switch to the bound event. `switchMap` ensures that the old event is removed when the
      // player is changed. If there's no player, return an observable that never emits.
      switchMap((player) => {
        return player ? fromEventPattern((listener) => {
          player.addEventListener(name, listener);
        }, (listener) => {
          try {
            player?.removeEventListener?.(name, listener);
          } catch {
          }
        }) : of();
      }),
      // By default we run all the API interactions outside the zone
      // so we have to bring the events back in manually when they emit.
      (source) => new Observable((observer) => source.subscribe({
        next: (value) => this._ngZone.run(() => observer.next(value)),
        error: (error) => observer.error(error),
        complete: () => observer.complete()
      })),
      // Ensures that everything is cleared out on destroy.
      takeUntil(this._destroyed)
    );
  }
  static ɵfac = function YouTubePlayer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _YouTubePlayer)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _YouTubePlayer,
    selectors: [["youtube-player"]],
    viewQuery: function YouTubePlayer_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.youtubeContainer = _t.first);
      }
    },
    inputs: {
      videoId: "videoId",
      height: [2, "height", "height", numberAttribute],
      width: [2, "width", "width", numberAttribute],
      startSeconds: [2, "startSeconds", "startSeconds", coerceTime],
      endSeconds: [2, "endSeconds", "endSeconds", coerceTime],
      suggestedQuality: "suggestedQuality",
      playerVars: "playerVars",
      disableCookies: [2, "disableCookies", "disableCookies", booleanAttribute],
      loadApi: [2, "loadApi", "loadApi", booleanAttribute],
      disablePlaceholder: [2, "disablePlaceholder", "disablePlaceholder", booleanAttribute],
      showBeforeIframeApiLoads: [2, "showBeforeIframeApiLoads", "showBeforeIframeApiLoads", booleanAttribute],
      placeholderButtonLabel: "placeholderButtonLabel",
      placeholderImageQuality: "placeholderImageQuality"
    },
    outputs: {
      ready: "ready",
      stateChange: "stateChange",
      error: "error",
      apiChange: "apiChange",
      playbackQualityChange: "playbackQualityChange",
      playbackRateChange: "playbackRateChange"
    },
    features: [ɵɵNgOnChangesFeature],
    decls: 4,
    vars: 3,
    consts: [["youtubeContainer", ""], [3, "videoId", "width", "height", "isLoading", "buttonLabel", "quality"], [3, "click", "videoId", "width", "height", "isLoading", "buttonLabel", "quality"]],
    template: function YouTubePlayer_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, YouTubePlayer_Conditional_0_Template, 1, 6, "youtube-player-placeholder", 1);
        ɵɵelementStart(1, "div");
        ɵɵelement(2, "div", null, 0);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵconditional(ctx._shouldShowPlaceholder() ? 0 : -1);
        ɵɵadvance();
        ɵɵstyleProp("display", ctx._shouldShowPlaceholder() ? "none" : "");
      }
    },
    dependencies: [YouTubePlayerPlaceholder],
    styles: ["youtube-player:fullscreen,youtube-player:fullscreen iframe{min-width:100vw;min-height:100vh}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(YouTubePlayer, [{
    type: Component,
    args: [{
      selector: "youtube-player",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [YouTubePlayerPlaceholder],
      template: `
    @if (_shouldShowPlaceholder()) {
      <youtube-player-placeholder
        [videoId]="videoId!"
        [width]="width"
        [height]="height"
        [isLoading]="_isLoading"
        [buttonLabel]="placeholderButtonLabel"
        [quality]="placeholderImageQuality"
        (click)="_load(true)"/>
    }
    <div [style.display]="_shouldShowPlaceholder() ? 'none' : ''">
      <div #youtubeContainer></div>
    </div>
  `,
      styles: ["youtube-player:fullscreen,youtube-player:fullscreen iframe{min-width:100vw;min-height:100vh}\n"]
    }]
  }], () => [], {
    videoId: [{
      type: Input
    }],
    height: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    width: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    startSeconds: [{
      type: Input,
      args: [{
        transform: coerceTime
      }]
    }],
    endSeconds: [{
      type: Input,
      args: [{
        transform: coerceTime
      }]
    }],
    suggestedQuality: [{
      type: Input
    }],
    playerVars: [{
      type: Input
    }],
    disableCookies: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    loadApi: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disablePlaceholder: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showBeforeIframeApiLoads: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    placeholderButtonLabel: [{
      type: Input
    }],
    placeholderImageQuality: [{
      type: Input
    }],
    ready: [{
      type: Output
    }],
    stateChange: [{
      type: Output
    }],
    error: [{
      type: Output
    }],
    apiChange: [{
      type: Output
    }],
    playbackQualityChange: [{
      type: Output
    }],
    playbackRateChange: [{
      type: Output
    }],
    youtubeContainer: [{
      type: ViewChild,
      args: ["youtubeContainer", {
        static: true
      }]
    }]
  });
})();
var apiLoaded = false;
function loadApi(nonce) {
  if (apiLoaded) {
    return;
  }
  const url = trustedResourceUrl`https://www.youtube.com/iframe_api`;
  const script = document.createElement("script");
  const callback = (event) => {
    script.removeEventListener("load", callback);
    script.removeEventListener("error", callback);
    if (event.type === "error") {
      apiLoaded = false;
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        console.error(`Failed to load YouTube API from ${url}`);
      }
    }
  };
  script.addEventListener("load", callback);
  script.addEventListener("error", callback);
  setScriptSrc(script, url);
  script.async = true;
  if (nonce) {
    script.setAttribute("nonce", nonce);
  }
  apiLoaded = true;
  document.body.appendChild(script);
}
var YouTubePlayerModule = class _YouTubePlayerModule {
  static ɵfac = function YouTubePlayerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _YouTubePlayerModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _YouTubePlayerModule,
    imports: [YouTubePlayer],
    exports: [YouTubePlayer]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(YouTubePlayerModule, [{
    type: NgModule,
    args: [{
      imports: [YouTubePlayer],
      exports: [YouTubePlayer]
    }]
  }], null, null);
})();
export {
  YOUTUBE_PLAYER_CONFIG,
  YouTubePlayer,
  YouTubePlayerModule
};
/*! Bundled license information:

safevalues/dist/mjs/environment/dev.js:
safevalues/dist/mjs/internals/secrets.js:
safevalues/dist/mjs/internals/attribute_impl.js:
safevalues/dist/mjs/internals/string_literal.js:
safevalues/dist/mjs/builders/sensitive_attributes.js:
safevalues/dist/mjs/builders/attribute_builders.js:
safevalues/dist/mjs/internals/trusted_types.js:
safevalues/dist/mjs/internals/pure.js:
safevalues/dist/mjs/internals/html_impl.js:
safevalues/dist/mjs/builders/document_fragment_builders.js:
safevalues/dist/mjs/internals/resource_url_impl.js:
safevalues/dist/mjs/internals/script_impl.js:
safevalues/dist/mjs/builders/html_builders.js:
safevalues/dist/mjs/builders/html_sanitizer/css/allowlists.js:
safevalues/dist/mjs/internals/style_sheet_impl.js:
safevalues/dist/mjs/dom/elements/style.js:
safevalues/dist/mjs/builders/html_sanitizer/resource_url_policy.js:
safevalues/dist/mjs/builders/html_sanitizer/css/tokens.js:
safevalues/dist/mjs/builders/html_sanitizer/css/serializer.js:
safevalues/dist/mjs/builders/html_sanitizer/css/tokenizer.js:
safevalues/dist/mjs/builders/html_sanitizer/css/sanitizer.js:
safevalues/dist/mjs/builders/url_builders.js:
safevalues/dist/mjs/builders/html_sanitizer/css/css_isolation.js:
safevalues/dist/mjs/dom/globals/range.js:
safevalues/dist/mjs/builders/html_sanitizer/inert_fragment.js:
safevalues/dist/mjs/builders/html_sanitizer/no_clobber.js:
safevalues/dist/mjs/builders/html_sanitizer/sanitizer_table/sanitizer_table.js:
safevalues/dist/mjs/builders/html_sanitizer/sanitizer_table/default_sanitizer_table.js:
safevalues/dist/mjs/builders/html_sanitizer/html_sanitizer.js:
safevalues/dist/mjs/builders/html_sanitizer/html_sanitizer_builder.js:
safevalues/dist/mjs/builders/html_sanitizer/default_css_sanitizer.js:
safevalues/dist/mjs/builders/resource_url_builders.js:
safevalues/dist/mjs/builders/script_builders.js:
safevalues/dist/mjs/builders/style_sheet_builders.js:
safevalues/dist/mjs/index.js:
safevalues/dist/mjs/dom/elements/anchor.js:
safevalues/dist/mjs/dom/elements/area.js:
safevalues/dist/mjs/dom/elements/base.js:
safevalues/dist/mjs/dom/elements/button.js:
safevalues/dist/mjs/dom/elements/embed.js:
safevalues/dist/mjs/dom/elements/form.js:
safevalues/dist/mjs/dom/elements/iframe.js:
safevalues/dist/mjs/dom/elements/input.js:
safevalues/dist/mjs/dom/elements/object.js:
safevalues/dist/mjs/dom/globals/window.js:
safevalues/dist/mjs/dom/elements/script.js:
safevalues/dist/mjs/dom/elements/element.js:
safevalues/dist/mjs/dom/elements/link.js:
safevalues/dist/mjs/dom/elements/svg.js:
safevalues/dist/mjs/dom/elements/svg_use.js:
safevalues/dist/mjs/dom/globals/document.js:
safevalues/dist/mjs/dom/globals/dom_parser.js:
safevalues/dist/mjs/dom/globals/fetch.js:
safevalues/dist/mjs/dom/globals/global.js:
safevalues/dist/mjs/dom/globals/location.js:
safevalues/dist/mjs/dom/globals/service_worker_container.js:
safevalues/dist/mjs/dom/globals/url.js:
safevalues/dist/mjs/dom/globals/worker.js:
safevalues/dist/mjs/dom/index.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=@angular_youtube-player.js.map
