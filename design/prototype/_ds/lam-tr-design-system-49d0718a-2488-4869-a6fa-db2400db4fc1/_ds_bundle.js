/* @ds-bundle: {"format":4,"namespace":"LamTrDesignSystem_49d071","components":[{"name":"OrderTracker","sourcePath":"components/commerce/OrderTracker.jsx"},{"name":"Price","sourcePath":"components/commerce/Price.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"ProductImage","sourcePath":"components/commerce/ProductImage.jsx"},{"name":"Rating","sourcePath":"components/commerce/Rating.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ICON_PATHS","sourcePath":"components/core/icon-paths.js"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"OptionPicker","sourcePath":"components/forms/OptionPicker.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/commerce/OrderTracker.jsx":"c94f7bfb896c","components/commerce/Price.jsx":"b9ca4691bd08","components/commerce/ProductCard.jsx":"c9146a28401c","components/commerce/ProductImage.jsx":"a83c329030f2","components/commerce/Rating.jsx":"eb4ac8391ce0","components/core/Badge.jsx":"41b6371fad9a","components/core/Button.jsx":"898d26f1551c","components/core/Icon.jsx":"b7ca3970f550","components/core/IconButton.jsx":"6694957f2587","components/core/Tag.jsx":"cb92ead8df71","components/core/icon-paths.js":"8612357c720f","components/feedback/Dialog.jsx":"60f4a5e51f4b","components/feedback/Toast.jsx":"2db35aa8e679","components/feedback/Tooltip.jsx":"6f9db7cd875f","components/forms/Checkbox.jsx":"d818140cb930","components/forms/Input.jsx":"cd1ce84d8d67","components/forms/OptionPicker.jsx":"70c7c5e182ec","components/forms/QuantityStepper.jsx":"6e4ed273ab62","components/forms/Radio.jsx":"6542b2b293a6","components/forms/Select.jsx":"c0aa63b2eebd","components/forms/Switch.jsx":"2f31e39dad73","components/navigation/Tabs.jsx":"12bfc6c0a742","ui_kits/admin/Admin.jsx":"1bcbf10d3d79","ui_kits/storefront/Cart.jsx":"bc64315d9536","ui_kits/storefront/Checkout.jsx":"141d8848ed3f","ui_kits/storefront/Chrome.jsx":"adab5601267c","ui_kits/storefront/Home.jsx":"968667dd1afb","ui_kits/storefront/Listing.jsx":"422b16084b6c","ui_kits/storefront/Orders.jsx":"041ed7105e47","ui_kits/storefront/Product.jsx":"186b1c5d535e","ui_kits/storefront/data.js":"1a3e97a54aa5"},"inlinedExternals":[],"unexposedExports":[{"name":"formatVND","sourcePath":"components/commerce/Price.jsx"}]} */

(() => {

const __ds_ns = (window.LamTrDesignSystem_49d071 = window.LamTrDesignSystem_49d071 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/Price.jsx
try { (() => {
function formatVND(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
}
function Price({
  value,
  compareAt,
  size = 'md',
  from,
  style
}) {
  const fs = size === 'lg' ? 'var(--fs-price-lg)' : size === 'sm' ? '14px' : 'var(--fs-price)';
  const off = compareAt && compareAt > value ? Math.round((1 - value / compareAt) * 100) : 0;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 8,
      flexWrap: 'wrap',
      fontFamily: 'var(--font-ui)',
      fontVariantNumeric: 'tabular-nums',
      ...style
    }
  }, from && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "T\u1EEB"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: fs,
      fontWeight: 600,
      color: off ? 'var(--sale)' : 'var(--text-price)'
    }
  }, formatVND(value)), off > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size === 'lg' ? 14 : 12,
      color: 'var(--text-price-old)',
      textDecoration: 'line-through'
    }
  }, formatVND(compareAt)));
}
Object.assign(__ds_scope, { formatVND, Price });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/Price.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductImage.jsx
try { (() => {
const TONES = {
  green: ['#DCD9C3', '#C9C6A8'],
  amber: ['#E6D3B5', '#D4B98F'],
  lotus: ['#EBD6D0', '#DDBDB4'],
  jasmine: ['#ECE6D6', '#DCD3BC'],
  matcha: ['#D3D9BE', '#BCC59F'],
  indigo: ['#D6DAE3', '#BEC4D2']
};
function ProductImage({
  src,
  alt = '',
  ratio = '4 / 5',
  tone = 'green',
  label,
  radius = 'var(--radius-card)',
  children,
  style
}) {
  const [a, b] = TONES[tone] || TONES.green;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: ratio,
      width: '100%',
      overflow: 'hidden',
      borderRadius: radius,
      background: src ? 'var(--surface-photo)' : 'radial-gradient(120% 90% at 50% 35%, ' + a + ' 0%, ' + b + ' 100%)',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 10,
      textAlign: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: 10,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'rgba(36,32,28,.42)'
    }
  }, label || 'Ảnh sản phẩm'), children);
}
Object.assign(__ds_scope, { ProductImage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductImage.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: ['var(--bg-sunken)', 'var(--text-body)'],
  primary: ['var(--primary-soft)', 'var(--primary)'],
  accent: ['var(--accent-soft)', 'var(--accent-hover)'],
  success: ['var(--success-soft)', 'var(--success)'],
  warning: ['var(--warning-soft)', 'var(--warning)'],
  danger: ['var(--danger-soft)', 'var(--danger)'],
  sale: ['var(--sale)', '#fff'],
  inverse: ['var(--surface-inverse)', 'var(--text-on-inverse)']
};
function Badge({
  tone = 'neutral',
  dot,
  children,
  style
}) {
  const [bg, fg] = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-xs)',
      background: bg,
      color: fg,
      fontFamily: 'var(--font-ui)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.04em',
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 3,
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/icon-paths.js
try { (() => {
// Lucide v0.460.0 (ISC) inner SVG markup, copied from lucide-static. Source files: assets/icons/*.svg
const ICON_PATHS = {
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /> <path d=\"m21 21-4.3-4.3\" />",
  "heart": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "plus": "<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />",
  "x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" /> <path d=\"M12 22V12\" /> <path d=\"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7\" /> <path d=\"m7.5 4.27 9 5.15\" />",
  "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /> <line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /> <line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
  "ticket-percent": "<path d=\"M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /> <path d=\"M9 9h.01\" /> <path d=\"m15 9-6 6\" /> <path d=\"M15 15h.01\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "gift": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\" /> <path d=\"M12 8v13\" /> <path d=\"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7\" /> <path d=\"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5\" />",
  "phone": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" />",
  "tag": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /> <circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"m9 12 2 2 4-4\" />",
  "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\" /> <path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\" />",
  "leaf": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\" /> <path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" />",
  "sliders-horizontal": "<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\" /> <line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\" /> <line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\" /> <line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\" /> <line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\" /> <line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\" /> <line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\" /> <line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\" /> <line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\" />",
  "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\" /> <path d=\"M15 18H9\" /> <path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\" /> <circle cx=\"17\" cy=\"18\" r=\"2\" /> <circle cx=\"7\" cy=\"18\" r=\"2\" />",
  "message-circle": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\" />",
  "trash-2": "<path d=\"M3 6h18\" /> <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /> <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /> <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /> <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />",
  "arrow-right": "<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />",
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "qr-code": "<rect width=\"5\" height=\"5\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"5\" height=\"5\" x=\"16\" y=\"3\" rx=\"1\" /> <rect width=\"5\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" /> <path d=\"M21 16h-3a2 2 0 0 0-2 2v3\" /> <path d=\"M21 21v.01\" /> <path d=\"M12 7v3a2 2 0 0 1-2 2H7\" /> <path d=\"M3 12h.01\" /> <path d=\"M12 3h.01\" /> <path d=\"M12 16v.01\" /> <path d=\"M16 12h1\" /> <path d=\"M21 12v.01\" /> <path d=\"M12 21v-1\" />",
  "layout-dashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\" /> <rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" />",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /> <polyline points=\"16 17 21 12 16 7\" /> <line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
  "megaphone": "<path d=\"m3 11 18-5v12L3 14v-3z\" /> <path d=\"M11.6 16.8a3 3 0 1 1-5.8-1.6\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /> <path d=\"M19 12H5\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16 14\" />",
  "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />",
  "boxes": "<path d=\"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z\" /> <path d=\"m7 16.5-4.74-2.85\" /> <path d=\"m7 16.5 5-3\" /> <path d=\"M7 16.5v5.17\" /> <path d=\"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z\" /> <path d=\"m17 16.5-5-3\" /> <path d=\"m17 16.5 4.74-2.85\" /> <path d=\"M17 16.5v5.17\" /> <path d=\"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z\" /> <path d=\"M12 8 7.26 5.15\" /> <path d=\"m12 8 4.74-2.85\" /> <path d=\"M12 13.5V8\" />",
  "calendar": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />",
  "facebook": "<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\" />",
  "store": "<path d=\"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7\" /> <path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\" /> <path d=\"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4\" /> <path d=\"M2 7h20\" /> <path d=\"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7\" />",
  "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <circle cx=\"9\" cy=\"9\" r=\"2\" /> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"17 8 12 3 7 8\" /> <line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"19\" cy=\"12\" r=\"1\" /> <circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\" /> <circle cx=\"6\" cy=\"12\" r=\"3\" /> <circle cx=\"18\" cy=\"19\" r=\"3\" /> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />",
  "scale": "<path d=\"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z\" /> <path d=\"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z\" /> <path d=\"M7 21h10\" /> <path d=\"M12 3v18\" /> <path d=\"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2\" />",
  "list": "<path d=\"M3 12h.01\" /> <path d=\"M3 18h.01\" /> <path d=\"M3 6h.01\" /> <path d=\"M8 12h13\" /> <path d=\"M8 18h13\" /> <path d=\"M8 6h13\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /> <path d=\"m15 5 4 4\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "receipt": "<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\" /> <path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\" /> <path d=\"M12 17.5v-11\" />",
  "circle-user": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" /> <path d=\"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662\" />",
  "shopping-bag": "<path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z\" /> <path d=\"M3 6h18\" /> <path d=\"M16 10a4 4 0 0 1-8 0\" />"
};
Object.assign(__ds_scope, { ICON_PATHS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/icon-paths.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color = 'currentColor',
  title,
  style,
  ...rest
}) {
  const inner = __ds_scope.ICON_PATHS[name] || '';
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    role: title ? 'img' : undefined,
    'aria-hidden': title ? undefined : true,
    'aria-label': title,
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    },
    ...rest
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/commerce/OrderTracker.jsx
try { (() => {
const DEFAULT_STEPS = [{
  key: 'placed',
  label: 'Đã đặt hàng',
  icon: 'receipt'
}, {
  key: 'confirmed',
  label: 'Đã xác nhận',
  icon: 'circle-check'
}, {
  key: 'shipping',
  label: 'Đang giao',
  icon: 'truck'
}, {
  key: 'completed',
  label: 'Hoàn thành',
  icon: 'package'
}];
function OrderTracker({
  current = 0,
  steps = DEFAULT_STEPS,
  times = [],
  orientation = 'horizontal',
  style
}) {
  const vertical = orientation === 'vertical';
  return /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, steps.map((s, i) => {
    const done = i < current,
      active = i === current,
      reached = i <= current;
    const dot = /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 16,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        background: reached ? 'var(--primary)' : 'var(--surface-card)',
        color: reached ? '#fff' : 'var(--text-subtle)',
        border: '1px solid ' + (reached ? 'var(--primary)' : 'var(--border-strong)'),
        boxShadow: active ? '0 0 0 4px var(--primary-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: done ? 'check' : s.icon,
      size: 16
    }));
    const line = i < steps.length - 1 && /*#__PURE__*/React.createElement("span", {
      style: vertical ? {
        position: 'absolute',
        left: 15.5,
        top: 32,
        bottom: 0,
        width: 1,
        background: done ? 'var(--primary)' : 'var(--border-strong)'
      } : {
        position: 'absolute',
        top: 16,
        left: '50%',
        width: '100%',
        height: 1,
        background: done ? 'var(--primary)' : 'var(--border-strong)'
      }
    });
    return vertical ? /*#__PURE__*/React.createElement("li", {
      key: s.key,
      style: {
        position: 'relative',
        display: 'flex',
        gap: 14,
        paddingBottom: i < steps.length - 1 ? 22 : 0
      }
    }, line, dot, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        color: reached ? 'var(--text-strong)' : 'var(--text-subtle)'
      }
    }, s.label), times[i] && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)'
      }
    }, times[i]))) : /*#__PURE__*/React.createElement("li", {
      key: s.key,
      style: {
        position: 'relative',
        flex: '1 1 0',
        minWidth: 0,
        display: 'grid',
        justifyItems: 'center',
        alignContent: 'start',
        rowGap: 8,
        textAlign: 'center'
      }
    }, line, dot, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        color: reached ? 'var(--text-strong)' : 'var(--text-subtle)',
        lineHeight: 1.3
      }
    }, s.label), times[i] && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)',
        marginTop: -6,
        lineHeight: 1.3
      }
    }, times[i]));
  }));
}
Object.assign(__ds_scope, { OrderTracker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/OrderTracker.jsx", error: String((e && e.message) || e) }); }

// components/commerce/Rating.jsx
try { (() => {
function Rating({
  value = 0,
  count,
  size = 14,
  interactive,
  onChange,
  style
}) {
  const [hover, setHover] = React.useState(0);
  const shown = hover || value;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: interactive ? 6 : 2
    },
    onMouseLeave: () => setHover(0)
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    onMouseEnter: () => interactive && setHover(i),
    onClick: () => interactive && onChange && onChange(i),
    style: {
      cursor: interactive ? 'pointer' : 'default',
      color: i <= Math.round(shown) ? 'var(--rating)' : 'var(--paper-400)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: size,
    style: {
      fill: i <= Math.round(shown) ? 'currentColor' : 'none'
    }
  })))), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, value.toFixed(1), " (", count, ")"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/Rating.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 36,
    padding: '0 14px',
    fontSize: 13,
    gap: 6,
    icon: 16
  },
  md: {
    height: 44,
    padding: '0 20px',
    fontSize: 14,
    gap: 8,
    icon: 18
  },
  lg: {
    height: 52,
    padding: '0 28px',
    fontSize: 15,
    gap: 10,
    icon: 20
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--primary)',
    fg: 'var(--text-on-primary)',
    bd: 'var(--primary)',
    hbg: 'var(--primary-hover)',
    hbd: 'var(--primary-hover)'
  },
  accent: {
    bg: 'var(--accent)',
    fg: 'var(--text-on-primary)',
    bd: 'var(--accent)',
    hbg: 'var(--accent-hover)',
    hbd: 'var(--accent-hover)'
  },
  secondary: {
    bg: 'transparent',
    fg: 'var(--text-strong)',
    bd: 'var(--text-strong)',
    hbg: 'var(--bg-sunken)',
    hbd: 'var(--text-strong)'
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--text-strong)',
    bd: 'transparent',
    hbg: 'var(--bg-sunken)',
    hbd: 'transparent'
  },
  link: {
    bg: 'transparent',
    fg: 'var(--text-link)',
    bd: 'transparent',
    hbg: 'transparent',
    hbd: 'transparent'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  disabled,
  loading,
  children,
  style,
  onClick,
  type = 'button',
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md,
    v = VARIANTS[variant] || VARIANTS.primary;
  const isLink = variant === 'link';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled || loading,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: isLink ? 'auto' : s.height,
      padding: isLink ? 0 : s.padding,
      width: fullWidth ? '100%' : undefined,
      fontFamily: 'var(--font-ui)',
      fontSize: s.fontSize,
      fontWeight: 500,
      letterSpacing: '.02em',
      color: v.fg,
      background: hover && !disabled ? v.hbg : v.bg,
      border: '1px solid ' + (hover && !disabled ? v.hbd : v.bd),
      borderRadius: 'var(--radius-button)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      textDecoration: isLink && hover ? 'underline' : 'none',
      textUnderlineOffset: 3,
      transform: press && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-fast)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }), loading ? 'Đang xử lý…' : children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 44,
  badge,
  active,
  disabled,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const filled = variant === 'filled',
    outline = variant === 'outline';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill)',
      padding: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      color: filled ? 'var(--text-on-primary)' : active ? 'var(--sale)' : 'var(--text-strong)',
      background: filled ? hover ? 'var(--primary-hover)' : 'var(--primary)' : variant === 'surface' ? 'rgba(251,248,242,.88)' : hover ? 'var(--bg-sunken)' : 'transparent',
      border: outline ? '1px solid var(--border-strong)' : '1px solid transparent',
      backdropFilter: variant === 'surface' ? 'blur(8px)' : undefined,
      transition: 'background var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.48),
    style: active ? {
      fill: 'currentColor'
    } : undefined
  }), badge != null && badge !== 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: size * 0.12,
      right: size * 0.1,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: 999,
      background: 'var(--accent)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 600,
      lineHeight: '16px',
      textAlign: 'center'
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function ProductCard({
  name,
  origin,
  price,
  compareAt,
  from,
  rating,
  reviews,
  badge,
  badgeTone = 'inverse',
  tone,
  image,
  wished,
  onWish,
  onClick,
  layout = 'vertical',
  style
}) {
  const [hover, setHover] = React.useState(false);
  if (layout === 'horizontal') {
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        cursor: 'pointer',
        fontFamily: 'var(--font-ui)',
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 84,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.ProductImage, {
      src: image,
      tone: tone,
      ratio: "1 / 1",
      label: " "
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minWidth: 0
      }
    }, origin && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, origin), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-title)',
        fontWeight: 500,
        fontSize: 15,
        color: 'var(--text-strong)',
        lineHeight: 1.3
      }
    }, name), /*#__PURE__*/React.createElement(__ds_scope.Price, {
      value: price,
      compareAt: compareAt,
      from: from,
      size: "sm"
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductImage, {
    src: image,
    tone: tone,
    style: {
      transform: hover ? 'scale(1.01)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }, badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: badgeTone,
    style: {
      position: 'absolute',
      top: 10,
      left: 10
    }
  }, badge), onWish && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 6,
      right: 6
    },
    onClick: e => {
      e.stopPropagation();
      onWish();
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "heart",
    label: "Y\xEAu th\xEDch",
    variant: "surface",
    size: 36,
    active: wished
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, origin && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, origin), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 500,
      fontSize: 15,
      lineHeight: 1.35,
      color: 'var(--text-strong)',
      textDecoration: hover ? 'underline' : 'none',
      textDecorationThickness: 1,
      textUnderlineOffset: 3
    }
  }, name), rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: reviews,
    size: 12
  }), /*#__PURE__*/React.createElement(__ds_scope.Price, {
    value: price,
    compareAt: compareAt,
    from: from,
    style: {
      marginTop: 2
    }
  })));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  selected,
  onClick,
  onRemove,
  icon,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-pressed": !!selected,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 36,
      padding: '0 14px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (selected ? 'var(--text-strong)' : hover ? 'var(--border-strong)' : 'var(--border-hairline)'),
      background: selected ? 'var(--text-strong)' : 'var(--surface-card)',
      color: selected ? 'var(--paper-50)' : 'var(--text-body)',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all var(--dur-base) var(--ease-out)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-flex',
      marginRight: -4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  variant = 'center',
  title,
  children,
  footer,
  onClose,
  inline,
  width = 420,
  style
}) {
  if (!open) return null;
  const sheet = variant === 'sheet';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: inline ? 'relative' : 'fixed',
      inset: inline ? undefined : 0,
      zIndex: 'var(--z-sheet)',
      display: 'flex',
      alignItems: sheet ? 'flex-end' : 'center',
      justifyContent: 'center',
      background: 'var(--overlay-scrim)',
      padding: sheet ? 0 : 20,
      minHeight: inline ? '100%' : undefined,
      height: inline ? '100%' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: sheet ? '100%' : width,
      maxWidth: '100%',
      maxHeight: '88%',
      overflow: 'auto',
      background: 'var(--surface-card)',
      fontFamily: 'var(--font-ui)',
      borderRadius: sheet ? 'var(--radius-sheet) var(--radius-sheet) 0 0' : 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, sheet && /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      background: 'var(--paper-400)',
      marginTop: 8
    }
  }), (title || onClose) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 20px 8px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      flex: 1,
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      letterSpacing: '-.01em',
      lineHeight: 1.25,
      color: 'var(--text-strong)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u0110\xF3ng",
    onClick: onClose,
    style: {
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      padding: 4,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 20px',
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      padding: '14px 20px',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONE = {
  neutral: ['var(--surface-inverse)', 'var(--text-on-inverse)', 'info'],
  success: ['var(--surface-inverse)', 'var(--text-on-inverse)', 'circle-check'],
  danger: ['var(--danger)', '#fff', 'triangle-alert']
};
function Toast({
  tone = 'neutral',
  title,
  message,
  action,
  onAction,
  onClose,
  style
}) {
  const [bg, fg, icon] = TONE[tone] || TONE.neutral;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '14px 16px',
      minWidth: 280,
      maxWidth: 420,
      borderRadius: 'var(--radius-md)',
      background: bg,
      color: fg,
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: tone === 'success' ? 'var(--tra-300)' : 'currentColor',
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, title), message && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      opacity: 0.82
    }
  }, message)), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--tra-300)',
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      padding: '2px 0'
    }
  }, action), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u0110\xF3ng",
    onClick: onClose,
    style: {
      border: 0,
      background: 'transparent',
      color: 'inherit',
      opacity: 0.7,
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  placement = 'top',
  children,
  open,
  style
}) {
  const [show, setShow] = React.useState(false);
  const visible = open != null ? open : show;
  const top = placement === 'top';
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      [top ? 'bottom' : 'top']: 'calc(100% + 8px)',
      transform: 'translateX(-50%) translateY(' + (visible ? 0 : top ? 4 : -4) + 'px)',
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      transition: 'opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-inverse)',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      lineHeight: 1.4,
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)',
      zIndex: 30
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      minHeight: 24,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      marginTop: 1,
      flexShrink: 0,
      borderRadius: 'var(--radius-xs)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid ' + (checked ? 'var(--primary)' : 'var(--border-strong)'),
      background: checked ? 'var(--primary)' : 'var(--surface-raised)',
      color: '#fff',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 2.25
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  iconLeft,
  suffix,
  multiline,
  rows = 3,
  id,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fid = id || (label ? 'in-' + label.replace(/\s+/g, '-') : undefined);
  const Tag = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: multiline ? 'flex-start' : 'center',
      gap: 8,
      minHeight: 44,
      padding: multiline ? '10px 12px' : '0 12px',
      background: 'var(--surface-raised)',
      borderRadius: 'var(--radius-input)',
      border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--border-focus)' : 'var(--border-strong)'),
      boxShadow: focus ? error ? '0 0 0 3px rgba(166,64,47,.18)' : 'var(--focus-ring)' : 'none',
      transition: 'box-shadow var(--dur-base), border-color var(--dur-base)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 18,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement(Tag, _extends({
    id: fid,
    rows: multiline ? rows : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: 15,
      color: 'var(--text-strong)',
      resize: 'vertical',
      padding: 0,
      height: multiline ? undefined : 42,
      ...inputStyle
    }
  }, rest)), suffix), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/OptionPicker.jsx
try { (() => {
function OptionPicker({
  label,
  options = [],
  value,
  onChange,
  columns,
  style
}) {
  const current = options.find(o => o.value === value);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'baseline',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, label), current && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, current.label)), /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + (columns || options.length) + ', minmax(0,1fr))',
      gap: 8
    }
  }, options.map(o => {
    const sel = o.value === value,
      dis = o.disabled;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      role: "radio",
      "aria-checked": sel,
      disabled: dis,
      onClick: () => onChange && onChange(o.value),
      style: {
        position: 'relative',
        minHeight: 48,
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        borderRadius: 'var(--radius-sm)',
        cursor: dis ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        border: sel ? '1.5px solid var(--text-strong)' : '1px solid var(--border-strong)',
        background: sel ? 'var(--surface-raised)' : 'transparent',
        color: dis ? 'var(--text-subtle)' : 'var(--text-strong)',
        textDecoration: dis ? 'line-through' : 'none',
        transition: 'border-color var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: sel ? 600 : 500
      }
    }, o.label), o.sub && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, o.sub));
  })));
}
Object.assign(__ds_scope, { OptionPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/OptionPicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  style
}) {
  const h = size === 'sm' ? 32 : 44;
  const set = n => onChange && onChange(Math.max(min, Math.min(max, n)));
  const btn = dis => ({
    width: h,
    height: h,
    border: 0,
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: dis ? 'var(--text-subtle)' : 'var(--text-strong)',
    cursor: dis ? 'not-allowed' : 'pointer',
    padding: 0
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: h,
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-raised)',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Gi\u1EA3m",
    disabled: value <= min,
    onClick: () => set(value - 1),
    style: btn(value <= min)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: size === 'sm' ? 24 : 32,
      textAlign: 'center',
      fontSize: size === 'sm' ? 13 : 15,
      fontWeight: 500,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "T\u0103ng",
    disabled: value >= max,
    onClick: () => set(value + 1),
    style: btn(value >= max)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  })));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  checked,
  onChange,
  label,
  description,
  name,
  value,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: !!checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      marginTop: 1,
      flexShrink: 0,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid ' + (checked ? 'var(--primary)' : 'var(--border-strong)'),
      background: 'var(--surface-raised)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 5,
      background: 'var(--primary)'
    }
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  error,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 44,
      padding: '0 40px 0 12px',
      fontFamily: 'inherit',
      fontSize: 15,
      color: value ? 'var(--text-strong)' : 'var(--text-subtle)',
      background: 'var(--surface-raised)',
      borderRadius: 'var(--radius-input)',
      border: '1px solid ' + (error ? 'var(--danger)' : 'var(--border-strong)'),
      cursor: 'pointer',
      outline: 0
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      top: 12,
      pointerEvents: 'none',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--danger)'
    }
  }, error));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      color: 'var(--text-strong)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": !!checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: 40,
      height: 24,
      borderRadius: 12,
      border: 0,
      padding: 0,
      cursor: 'inherit',
      background: checked ? 'var(--primary)' : 'var(--paper-400)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 19 : 3,
      width: 18,
      height: 18,
      borderRadius: 9,
      background: '#fff',
      boxShadow: 'var(--shadow-xs)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  style
}) {
  const seg = variant === 'segmented';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: seg ? 2 : 24,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      fontFamily: 'var(--font-ui)',
      borderBottom: seg ? 0 : '1px solid var(--border-hairline)',
      background: seg ? 'var(--bg-sunken)' : 'transparent',
      padding: seg ? 3 : 0,
      borderRadius: seg ? 'var(--radius-sm)' : 0,
      ...style
    }
  }, items.map(it => {
    const v = typeof it === 'string' ? it : it.value,
      l = typeof it === 'string' ? it : it.label,
      c = typeof it === 'string' ? null : it.count;
    const sel = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": sel,
      type: "button",
      onClick: () => onChange && onChange(v),
      style: {
        flex: seg ? 1 : '0 0 auto',
        height: seg ? 36 : 44,
        padding: seg ? '0 12px' : 0,
        border: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: sel ? 600 : 500,
        whiteSpace: 'nowrap',
        color: sel ? 'var(--text-strong)' : 'var(--text-muted)',
        background: seg && sel ? 'var(--surface-raised)' : 'transparent',
        borderRadius: seg ? 3 : 0,
        boxShadow: seg && sel ? 'var(--shadow-xs)' : 'none',
        borderBottom: seg ? 0 : '2px solid ' + (sel ? 'var(--text-strong)' : 'transparent'),
        marginBottom: seg ? 0 : -1,
        transition: 'color var(--dur-base), border-color var(--dur-base)'
      }
    }, l, c != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        fontSize: 12,
        color: 'var(--text-subtle)',
        fontWeight: 500
      }
    }, c));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Admin.jsx
try { (() => {
const {
  Icon: AIcon,
  Badge: ABadge,
  Button: ABtn,
  Input: AIn,
  Switch: ASw,
  Tabs: ATabs,
  Checkbox: AChk,
  Dialog: ADlg,
  Select: ASel,
  OrderTracker: AOT,
  ProductImage: API
} = window.LamTrDesignSystem_49d071;
const afmt = window.LT_FMT;
const A_STAGE = [['neutral', 'Đã đặt'], ['primary', 'Đã xác nhận'], ['warning', 'Đang giao'], ['success', 'Hoàn thành'], ['danger', 'Đã huỷ']];
function Sidebar({
  view,
  setView
}) {
  const items = [['orders', 'receipt', 'Đơn hàng', 4], ['products', 'boxes', 'Sản phẩm & kho'], ['promos', 'megaphone', 'Khuyến mãi']];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flexShrink: 0,
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-inverse-muted)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 8px 22px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/lam-tra-emblem.svg",
    style: {
      height: 38
    },
    alt: "Lam Tr\xE0"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--text-on-inverse-accent)',
      whiteSpace: 'nowrap'
    }
  }, "Qu\u1EA3n tr\u1ECB")), items.map(([k, ic, l, n]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    onClick: () => setView(k),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 40,
      padding: '0 12px',
      border: 0,
      borderRadius: 4,
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 14,
      background: view === k ? 'rgba(253,237,216,.1)' : 'transparent',
      boxShadow: view === k ? 'inset 2px 0 0 var(--tra-400)' : 'none',
      color: view === k ? 'var(--text-on-inverse)' : 'var(--text-on-inverse-muted)',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(AIcon, {
    name: ic,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, l), n && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      background: 'var(--tra-400)',
      color: 'var(--reu-900)',
      borderRadius: 999,
      padding: '1px 7px',
      fontWeight: 600
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 8px',
      borderTop: '1px solid rgba(253,237,216,.14)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(AIcon, {
    name: "circle-user",
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--text-on-inverse)'
    }
  }, "Ch\u1EE7 c\u1EEDa h\xE0ng"), /*#__PURE__*/React.createElement(AIcon, {
    name: "log-out",
    size: 16
  })));
}
function PageHead({
  title,
  sub,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, sub)), actions);
}
const th = {
  textAlign: 'left',
  fontSize: 11,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontWeight: 500,
  padding: '10px 14px',
  borderBottom: '1px solid var(--border-hairline)',
  whiteSpace: 'nowrap'
};
const td = {
  padding: '14px',
  borderBottom: '1px solid var(--border-hairline)',
  fontSize: 14,
  color: 'var(--text-body)',
  verticalAlign: 'middle'
};
function OrdersView() {
  const [orders, setOrders] = React.useState([{
    id: 'LT2412',
    name: 'Nguyễn Thu Hà',
    phone: '0912 345 678',
    items: 'Trà Đinh Sen 300g · Hạng 1 ×1',
    total: 608000,
    pay: 'VietQR',
    paid: true,
    stage: 0,
    time: '16:24 · 19/10'
  }, {
    id: 'LT2411',
    name: 'Trần Minh Đức',
    phone: '0987 112 334',
    items: 'Hộp quà Trao Gửi ×2',
    total: 1300000,
    pay: 'VietQR',
    paid: false,
    stage: 0,
    time: '14:02 · 19/10'
  }, {
    id: 'LT2410',
    name: 'Lê Hoàng Yến',
    phone: '0903 556 778',
    items: 'Trà Móc Câu 500g · Hạng 2 ×1',
    total: 368000,
    pay: 'COD',
    paid: false,
    stage: 1,
    time: '09:47 · 19/10'
  }, {
    id: 'LT2398',
    name: 'Phạm Quốc Bảo',
    phone: '0938 220 119',
    items: 'Trà Nõn Tôm 150g ×2',
    total: 470000,
    pay: 'VietQR',
    paid: true,
    stage: 2,
    time: '09:12 · 16/10'
  }, {
    id: 'LT2311',
    name: 'Đỗ Thanh Mai',
    phone: '0977 884 210',
    items: 'Hộp quà Trao Gửi ×1',
    total: 650000,
    pay: 'COD',
    paid: true,
    stage: 3,
    time: '20:31 · 02/10'
  }]);
  const [tab, setTab] = React.useState('all');
  const [sel, setSel] = React.useState(null);
  const counts = s => orders.filter(o => o.stage === s).length;
  const list = orders.filter(o => tab === 'all' || o.stage === +tab);
  const o = orders.find(x => x.id === sel);
  const advance = id => setOrders(os => os.map(x => x.id === id ? {
    ...x,
    stage: Math.min(3, x.stage + 1),
    paid: x.stage >= 0 ? true : x.paid
  } : x));
  const next = ['Xác nhận đơn', 'Giao cho vận chuyển', 'Đánh dấu hoàn thành'];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    title: "\u0110\u01A1n h\xE0ng",
    sub: "X\xE1c nh\u1EADn thanh to\xE1n VietQR v\xE0 c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i \u2014 kh\xE1ch nh\u1EADn th\xF4ng b\xE1o \u1EDF m\u1ED7i b\u01B0\u1EDBc.",
    actions: /*#__PURE__*/React.createElement(AIn, {
      iconLeft: "search",
      placeholder: "T\xECm m\xE3 \u0111\u01A1n, S\u0110T\u2026",
      style: {
        width: 260
      }
    })
  }), /*#__PURE__*/React.createElement(ATabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'all',
      label: 'Tất cả',
      count: orders.length
    }, {
      value: '0',
      label: 'Chờ xác nhận',
      count: counts(0)
    }, {
      value: '1',
      label: 'Đã xác nhận',
      count: counts(1)
    }, {
      value: '2',
      label: 'Đang giao',
      count: counts(2)
    }, {
      value: '3',
      label: 'Hoàn thành',
      count: counts(3)
    }]
  }), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'var(--surface-card)',
      marginTop: 16,
      border: '1px solid var(--border-hairline)',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "M\xE3 \u0111\u01A1n"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Kh\xE1ch h\xE0ng"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "S\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Thanh to\xE1n"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "T\u1ED5ng"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Tr\u1EA1ng th\xE1i"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, list.map(x => /*#__PURE__*/React.createElement("tr", {
    key: x.id,
    onClick: () => setSel(x.id),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, x.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-subtle)'
    }
  }, x.time)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, x.name, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-subtle)'
    }
  }, x.phone)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      maxWidth: 240
    }
  }, x.items), /*#__PURE__*/React.createElement("td", {
    style: td
  }, x.pay, " ", /*#__PURE__*/React.createElement("div", null, x.paid ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--success)'
    }
  }, "\u0110\xE3 nh\u1EADn ti\u1EC1n") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--warning)'
    }
  }, "Ch\u01B0a nh\u1EADn"))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right',
      fontWeight: 600,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, afmt(x.total)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(ABadge, {
    tone: A_STAGE[x.stage][0],
    dot: true
  }, A_STAGE[x.stage][1])), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    },
    onClick: e => e.stopPropagation()
  }, x.stage < 3 && /*#__PURE__*/React.createElement(ABtn, {
    size: "sm",
    variant: x.stage === 0 ? 'primary' : 'secondary',
    onClick: () => advance(x.id)
  }, next[x.stage])))))), o && /*#__PURE__*/React.createElement(ADlg, {
    title: 'Đơn ' + o.id,
    onClose: () => setSel(null),
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ABtn, {
      variant: "ghost",
      onClick: () => setSel(null)
    }, "\u0110\xF3ng"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), o.stage < 3 && /*#__PURE__*/React.createElement(ABtn, {
      onClick: () => advance(o.id)
    }, next[o.stage]))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(AOT, {
    current: o.stage
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      rowGap: 8,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Kh\xE1ch h\xE0ng"), /*#__PURE__*/React.createElement("span", null, o.name, " \xB7 ", o.phone), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "S\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("span", null, o.items), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Thanh to\xE1n"), /*#__PURE__*/React.createElement("span", null, o.pay, " \xB7 ", o.paid ? 'Đã nhận tiền' : 'Chưa nhận'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "T\u1ED5ng"), /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-strong)'
    }
  }, afmt(o.total))))));
}
function ProductsView() {
  const {
    products,
    priceOf
  } = window.LT_DATA;
  const [rows, setRows] = React.useState(() => products.map((p, i) => ({
    ...p,
    live: i !== 6,
    stock: [42, 120, 8, 15, 30, 64, 0, 22][i]
  })));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    title: "S\u1EA3n ph\u1EA9m & kho",
    sub: "M\u1ED7i s\u1EA3n ph\u1EA9m c\xF3 3 kh\u1ED1i l\u01B0\u1EE3ng \xD7 2 ph\xE2n h\u1EA1ng; t\u1ED3n kho t\xEDnh theo gram.",
    actions: /*#__PURE__*/React.createElement(ABtn, {
      iconLeft: "plus"
    }, "Th\xEAm s\u1EA3n ph\u1EA9m")
  }), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "S\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Gi\xE1 t\u1EEB"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Bi\u1EBFn th\u1EC3"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "T\u1ED3n kho"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "\u0110ang b\xE1n"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map((p, i) => /*#__PURE__*/React.createElement("tr", {
    key: p.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      width: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44
    }
  }, /*#__PURE__*/React.createElement(API, {
    tone: p.tone,
    ratio: "1 / 1",
    label: " ",
    radius: "4px"
  }))), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-subtle)'
    }
  }, p.origin)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontVariantNumeric: 'tabular-nums'
    }
  }, afmt(priceOf(p, '150', '2'))), /*#__PURE__*/React.createElement("td", {
    style: td
  }, p.fixed ? '1 bộ' : '150 · 300 · 500g · H1/H2'), /*#__PURE__*/React.createElement("td", {
    style: td
  }, p.stock === 0 ? /*#__PURE__*/React.createElement(ABadge, {
    tone: "danger"
  }, "H\u1EBFt h\xE0ng") : p.stock < 10 ? /*#__PURE__*/React.createElement(ABadge, {
    tone: "warning"
  }, "C\xF2n ", p.stock) : /*#__PURE__*/React.createElement("span", null, p.stock, " ", p.fixed ? 'hộp' : 'gói')), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(ASw, {
    checked: p.live,
    onChange: v => setRows(r => r.map((x, j) => j === i ? {
      ...x,
      live: v
    } : x))
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(ABtn, {
    size: "sm",
    variant: "ghost",
    iconLeft: "pencil"
  }, "S\u1EEDa")))))));
}
function PromosView() {
  const [promos, setPromos] = React.useState([{
    code: 'LAMTRA10',
    desc: 'Giảm 10% toàn bộ trà sen',
    used: 38,
    limit: 200,
    end: '31/10/2026',
    on: true
  }, {
    code: 'QUATET',
    desc: 'Giảm 80.000₫ cho hộp quà từ 600.000₫',
    used: 0,
    limit: 100,
    end: '15/02/2027',
    on: false
  }, {
    code: 'FREESHIP',
    desc: 'Miễn phí vận chuyển đơn từ 300.000₫',
    used: 112,
    limit: 300,
    end: '30/11/2026',
    on: true
  }]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    title: "Khuy\u1EBFn m\xE3i",
    sub: "M\xE3 gi\u1EA3m gi\xE1 v\xE0 chi\u1EBFn d\u1ECBch theo m\xF9a.",
    actions: /*#__PURE__*/React.createElement(ABtn, {
      iconLeft: "plus"
    }, "T\u1EA1o m\xE3")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
      gap: 16
    }
  }, promos.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.code,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 6,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)',
      letterSpacing: '.04em'
    }
  }, p.code), /*#__PURE__*/React.createElement(ASw, {
    checked: p.on,
    onChange: v => setPromos(x => x.map((y, j) => j === i ? {
      ...y,
      on: v
    } : y))
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14
    }
  }, p.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: 'var(--bg-sunken)',
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: p.used / p.limit * 100 + '%',
      height: '100%',
      background: 'var(--accent)',
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u0110\xE3 d\xF9ng ", p.used, "/", p.limit), /*#__PURE__*/React.createElement("span", null, "H\u1EBFt h\u1EA1n ", p.end))))));
}
Object.assign(window, {
  Sidebar,
  OrdersView,
  ProductsView,
  PromosView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Cart.jsx
try { (() => {
const {
  ProductImage: CPI,
  QuantityStepper: CQty,
  Input: CIn,
  Button: CBtn,
  IconButton: CIB,
  Icon: CIcon
} = window.LamTrDesignSystem_49d071;
const cfmt = window.LT_FMT;
function Summary({
  subtotal,
  discount,
  shipping
}) {
  const row = (l, v, strong) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: strong ? 16 : 14,
      fontWeight: strong ? 600 : 400,
      color: strong ? 'var(--text-strong)' : 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, v));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, row('Tạm tính', cfmt(subtotal)), discount > 0 && row('Giảm giá', '−' + cfmt(discount)), row('Phí vận chuyển', shipping === 0 ? 'Miễn phí' : cfmt(shipping)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-hairline)',
      margin: '4px 0'
    }
  }), row('Tổng cộng', cfmt(subtotal - discount + shipping), true));
}
function CartScreen({
  cart,
  setQty,
  remove,
  go,
  code,
  setCode
}) {
  const {
    products
  } = window.LT_DATA;
  const [draft, setDraft] = React.useState(code || '');
  const [err, setErr] = React.useState('');
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = code === 'LAMTRA10' ? Math.round(subtotal * 0.1 / 1000) * 1000 : 0;
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  if (!cart.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '80px 32px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(CIcon, {
    name: "shopping-bag",
    size: 40,
    color: "var(--text-subtle)"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22
    }
  }, "Gi\u1ECF h\xE0ng \u0111ang tr\u1ED1ng"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Ch\u1ECDn m\u1ED9t lo\u1EA1i tr\xE0 b\u1EA1n th\xEDch \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u."), /*#__PURE__*/React.createElement(CBtn, {
    onClick: () => go('listing')
  }, "Xem s\u1EA3n ph\u1EA9m"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30
    }
  }, "Gi\u1ECF h\xE0ng ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: 'var(--text-muted)'
    }
  }, "(", cart.length, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, cart.map((it, i) => {
    const p = products.find(x => x.id === it.id);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 14,
        padding: '16px 0',
        borderTop: i ? '1px solid var(--border-hairline)' : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 88,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(CPI, {
      tone: p.tone,
      ratio: "1 / 1",
      label: " "
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: 'var(--font-title)',
        fontWeight: 500,
        fontSize: 15,
        color: 'var(--text-strong)'
      }
    }, p.name), /*#__PURE__*/React.createElement(CIB, {
      icon: "trash-2",
      label: "Xo\xE1",
      size: 32,
      onClick: () => remove(i)
    })), it.size && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)'
      }
    }, it.size, "g \xB7 H\u1EA1ng ", it.grade), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(CQty, {
      size: "sm",
      value: it.qty,
      onChange: n => setQty(i, n)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, cfmt(it.price * it.qty)))));
  })), /*#__PURE__*/React.createElement(CIn, {
    label: "M\xE3 gi\u1EA3m gi\xE1",
    placeholder: "Nh\u1EADp m\xE3, v\xED d\u1EE5 LAMTRA10",
    value: draft,
    onChange: e => {
      setDraft(e.target.value.toUpperCase());
      setErr('');
    },
    error: err,
    hint: code ? 'Đã áp dụng ' + code + ' · giảm 10%' : undefined,
    suffix: /*#__PURE__*/React.createElement(CBtn, {
      variant: "link",
      size: "sm",
      onClick: () => {
        if (draft === 'LAMTRA10') setCode(draft);else {
          setErr('Mã không hợp lệ hoặc đã hết hạn');
          setCode('');
        }
      }
    }, "\xC1p d\u1EE5ng")
  }), shipping > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(CIcon, {
    name: "truck",
    size: 16
  }), "Mua th\xEAm ", cfmt(500000 - subtotal), " \u0111\u1EC3 \u0111\u01B0\u1EE3c mi\u1EC5n ph\xED v\u1EADn chuy\u1EC3n"), /*#__PURE__*/React.createElement(Summary, {
    subtotal: subtotal,
    discount: discount,
    shipping: shipping
  }), /*#__PURE__*/React.createElement(CBtn, {
    size: "lg",
    fullWidth: true,
    iconRight: "arrow-right",
    onClick: () => go('checkout')
  }, "Ti\u1EBFn h\xE0nh \u0111\u1EB7t h\xE0ng"));
}
Object.assign(window, {
  CartScreen,
  Summary
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Checkout.jsx
try { (() => {
const {
  Input: KIn,
  Select: KSel,
  Radio: KRadio,
  Checkbox: KChk,
  Button: KBtn,
  Icon: KIcon,
  Toast: KToast
} = window.LamTrDesignSystem_49d071;
const kfmt = window.LT_FMT;
function Block({
  n,
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      display: 'flex',
      gap: 10,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      color: 'var(--accent)',
      fontWeight: 600
    }
  }, "0", n), title), children);
}
function CheckoutScreen({
  total,
  placeOrder
}) {
  const [ship, setShip] = React.useState('std');
  const [pay, setPay] = React.useState('qr');
  const [wrap, setWrap] = React.useState(false);
  const [prov, setProv] = React.useState('Hà Nội');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement(Block, {
    n: 1,
    title: "Th\xF4ng tin nh\u1EADn h\xE0ng"
  }, /*#__PURE__*/React.createElement(KIn, {
    label: "H\u1ECD v\xE0 t\xEAn",
    defaultValue: "Nguy\u1EC5n Thu H\xE0"
  }), /*#__PURE__*/React.createElement(KIn, {
    label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
    type: "tel",
    defaultValue: "0912 345 678",
    hint: "D\xF9ng \u0111\u1EC3 nh\u1EADn th\xF4ng b\xE1o \u0111\u01A1n h\xE0ng qua Zalo"
  }), /*#__PURE__*/React.createElement(KSel, {
    label: "T\u1EC9nh / Th\xE0nh ph\u1ED1",
    value: prov,
    onChange: setProv,
    options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Thái Nguyên', 'Đà Nẵng']
  }), /*#__PURE__*/React.createElement(KIn, {
    label: "\u0110\u1ECBa ch\u1EC9",
    defaultValue: "18 Phan \u0110\xECnh Ph\xF9ng, Ba \u0110\xECnh"
  }), /*#__PURE__*/React.createElement(KIn, {
    label: "Ghi ch\xFA",
    multiline: true,
    rows: 2,
    placeholder: "V\xED d\u1EE5: giao gi\u1EDD h\xE0nh ch\xEDnh"
  })), /*#__PURE__*/React.createElement(Block, {
    n: 2,
    title: "V\u1EADn chuy\u1EC3n"
  }, /*#__PURE__*/React.createElement(KRadio, {
    name: "ship",
    value: "std",
    checked: ship === 'std',
    onChange: setShip,
    label: "Giao ti\xEAu chu\u1EA9n",
    description: "2\u20134 ng\xE0y \xB7 Mi\u1EC5n ph\xED t\u1EEB 500.000\u20AB"
  }), /*#__PURE__*/React.createElement(KRadio, {
    name: "ship",
    value: "fast",
    checked: ship === 'fast',
    onChange: setShip,
    label: "Giao nhanh",
    description: "Trong ng\xE0y t\u1EA1i H\xE0 N\u1ED9i \xB7 45.000\u20AB"
  }), /*#__PURE__*/React.createElement(KChk, {
    checked: wrap,
    onChange: setWrap,
    label: "G\xF3i qu\xE0 k\xE8m thi\u1EC7p",
    description: "Vi\u1EBFt l\u1EDDi nh\u1EAFn \u1EDF b\u01B0\u1EDBc sau"
  })), /*#__PURE__*/React.createElement(Block, {
    n: 3,
    title: "Thanh to\xE1n"
  }, /*#__PURE__*/React.createElement(KRadio, {
    name: "pay",
    value: "qr",
    checked: pay === 'qr',
    onChange: setPay,
    label: "Chuy\u1EC3n kho\u1EA3n VietQR",
    description: "Qu\xE9t m\xE3 b\u1EB1ng app ng\xE2n h\xE0ng b\u1EA5t k\u1EF3"
  }), /*#__PURE__*/React.createElement(KRadio, {
    name: "pay",
    value: "cod",
    checked: pay === 'cod',
    onChange: setPay,
    label: "Thanh to\xE1n khi nh\u1EADn h\xE0ng",
    description: "\xC1p d\u1EE5ng cho \u0111\u01A1n d\u01B0\u1EDBi 2.000.000\u20AB"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-strong)',
      paddingTop: 8,
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "T\u1ED5ng thanh to\xE1n"), /*#__PURE__*/React.createElement("span", null, kfmt(total + (ship === 'fast' ? 45000 : 0)))), /*#__PURE__*/React.createElement(KBtn, {
    size: "lg",
    fullWidth: true,
    onClick: () => placeOrder(pay)
  }, "\u0110\u1EB7t h\xE0ng"));
}
function PaymentScreen({
  order,
  paid
}) {
  const [copied, setCopied] = React.useState('');
  const row = (l, v, copy) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 0',
      borderTop: '1px solid var(--border-hairline)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 110,
      color: 'var(--text-muted)'
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, v), copy && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setCopied(l);
      setTimeout(() => setCopied(''), 1800);
    },
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--text-link)',
      cursor: 'pointer',
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      fontSize: 13,
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "copy",
    size: 15
  }), "Sao ch\xE9p"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "\u0110\u01A1n h\xE0ng ", order.id), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26
    }
  }, "Qu\xE9t m\xE3 \u0111\u1EC3 thanh to\xE1n"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "M\u1EDF app ng\xE2n h\xE0ng, ch\u1ECDn qu\xE9t QR. S\u1ED1 ti\u1EC1n v\xE0 n\u1ED9i dung \u0111\xE3 \u0111\u01B0\u1EE3c \u0111i\u1EC1n s\u1EB5n.")), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'center',
      width: 240,
      padding: 16,
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 208,
      height: 208,
      background: 'var(--paper-100)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: 'var(--text-muted)',
      fontSize: 11,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "qr-code",
    size: 56,
    strokeWidth: 1.25
  }), "M\xE3 VietQR sinh t\u1EF1 \u0111\u1ED9ng"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "H\u1EBFt h\u1EA1n sau 14:52")), /*#__PURE__*/React.createElement("div", null, row('Ngân hàng', 'Vietcombank'), row('Số tài khoản', '0123 456 789', true), row('Chủ tài khoản', 'LAM TRA'), row('Số tiền', kfmt(order.total), true), row('Nội dung', order.id, true)), /*#__PURE__*/React.createElement(KBtn, {
    size: "lg",
    fullWidth: true,
    onClick: paid
  }, "T\xF4i \u0111\xE3 chuy\u1EC3n kho\u1EA3n"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      textAlign: 'center'
    }
  }, "Lam Tr\xE0 s\u1EBD x\xE1c nh\u1EADn v\xE0 nh\u1EAFn tin qua Zalo trong v\xF2ng 30 ph\xFAt."), copied && /*#__PURE__*/React.createElement(KToast, {
    tone: "success",
    title: 'Đã sao chép ' + copied.toLowerCase(),
    style: {
      position: 'fixed',
      left: '50%',
      bottom: 90,
      transform: 'translateX(-50%)',
      minWidth: 0
    }
  }));
}
Object.assign(window, {
  CheckoutScreen,
  PaymentScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Checkout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Chrome.jsx
try { (() => {
const {
  Icon,
  IconButton,
  Badge
} = window.LamTrDesignSystem_49d071;
function Header({
  title,
  onBack,
  cartCount,
  go,
  transparent
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 8px',
      background: transparent ? 'transparent' : 'rgba(247,240,227,.94)',
      backdropFilter: transparent ? 'none' : 'blur(10px)',
      borderBottom: transparent ? '0' : '1px solid var(--border-hairline)'
    }
  }, onBack ? /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    label: "Quay l\u1EA1i",
    onClick: onBack
  }) : /*#__PURE__*/React.createElement(IconButton, {
    icon: "menu",
    label: "Danh m\u1EE5c",
    onClick: () => go('listing')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    }
  }, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 500,
      fontSize: 16,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, title) : /*#__PURE__*/React.createElement("span", {
    onClick: () => go('home'),
    style: {
      width: 40,
      height: 40,
      borderRadius: 6,
      background: 'var(--logo-green)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/lam-tra-emblem.svg",
    alt: "Lam Tr\xE0",
    style: {
      height: 32
    }
  }))), /*#__PURE__*/React.createElement(IconButton, {
    icon: "search",
    label: "T\xECm ki\u1EBFm",
    onClick: () => go('listing')
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "shopping-bag",
    label: "Gi\u1ECF h\xE0ng",
    badge: cartCount,
    onClick: () => go('cart')
  }));
}
function BottomNav({
  route,
  go,
  wishCount
}) {
  const items = [['home', 'house', 'Trang chủ'], ['listing', 'leaf', 'Sản phẩm'], ['wish', 'heart', 'Yêu thích'], ['orders', 'receipt', 'Đơn hàng'], ['account', 'circle-user', 'Tài khoản']];
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'sticky',
      bottom: 0,
      zIndex: 20,
      height: 64,
      display: 'flex',
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, items.map(([k, ic, l]) => {
    const on = route === k || k === 'listing' && route === 'product';
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => go(k === 'wish' || k === 'account' ? 'listing' : k),
      style: {
        flex: 1,
        border: 0,
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        cursor: 'pointer',
        color: on ? 'var(--text-strong)' : 'var(--text-subtle)',
        fontFamily: 'var(--font-ui)',
        fontSize: 10.5,
        fontWeight: on ? 600 : 500
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 22,
      strokeWidth: on ? 1.75 : 1.5
    }), l);
  }));
}
function ZaloButton({
  bottom = 80
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      position: 'absolute',
      right: 16,
      bottom,
      zIndex: 25,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 44,
      padding: '0 16px 0 12px',
      borderRadius: 999,
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-inverse)',
      textDecoration: 'none',
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 20
  }), "Chat Zalo");
}
function SectionHead({
  eyebrow,
  title,
  action,
  onAction,
  inverse
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      fontWeight: 500,
      color: inverse ? 'var(--text-on-inverse-accent)' : 'var(--accent)',
      marginBottom: 6
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26,
      color: inverse ? 'var(--paper-100)' : 'var(--text-strong)'
    }
  }, title)), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      border: 0,
      background: 'transparent',
      padding: '4px 0',
      fontSize: 13,
      fontWeight: 500,
      color: inverse ? 'var(--paper-100)' : 'var(--text-strong)',
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, action));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-inverse-deep)',
      color: 'var(--text-on-inverse-muted)',
      padding: '40px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/lam-tra-logo.svg",
    alt: "Lam Tr\xE0",
    style: {
      width: 120,
      alignSelf: 'flex-start',
      marginLeft: -8
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 500,
      color: 'var(--text-on-inverse)',
      lineHeight: 1.3
    }
  }, "Tr\u1ECDn v\u1ECB tr\xE0 Vi\u1EC7t,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-on-inverse-accent)'
    }
  }, "tr\u1ECDn t\u1EA5m l\xF2ng trao g\u1EEDi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 16
  }), "C\u1EEDa h\xE0ng: T\xE2n C\u01B0\u01A1ng, TP. Th\xE1i Nguy\xEAn"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 16
  }), "0912 345 678 \xB7 Zalo c\xF9ng s\u1ED1")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, ['Facebook', 'TikTok', 'Zalo'].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    style: {
      color: 'var(--paper-100)',
      fontSize: 13
    }
  }, s))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-on-inverse-muted)',
      opacity: .8
    }
  }, "\xA9 2026 Lam Tr\xE0"));
}
Object.assign(window, {
  Header,
  BottomNav,
  ZaloButton,
  SectionHead,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
const {
  ProductCard: HPC,
  ProductImage: HPI,
  Tag: HTag,
  Button: HBtn
} = window.LamTrDesignSystem_49d071;
function HomeScreen({
  go,
  openProduct,
  wish,
  toggleWish
}) {
  const {
    products,
    cats,
    priceOf
  } = window.LT_DATA;
  const best = products.filter(p => !p.fixed).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(HPI, {
    tone: "amber",
    ratio: "4 / 5",
    radius: "0",
    label: "\u1EA2nh ch\u1EE7 \u0111\u1EA1o \xB7 \u1EA5m tr\xE0, b\xE0n g\u1ED7, n\u1EAFng s\u1EDBm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(25,36,26,0) 35%, rgba(25,36,26,.78) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 28,
      color: 'var(--paper-50)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--paper-100)',
      fontWeight: 500
    }
  }, "Tr\xE0 T\xE2n C\u01B0\u01A1ng \xB7 Th\xE1i Nguy\xEAn"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 36,
      lineHeight: 1.2,
      color: 'var(--paper-50)'
    }
  }, "Tr\u1ECDn v\u1ECB tr\xE0 Vi\u1EC7t,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--tra-300)'
    }
  }, "tr\u1ECDn t\u1EA5m l\xF2ng trao g\u1EEDi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(HBtn, {
    onClick: () => go('listing'),
    style: {
      background: 'var(--paper-50)',
      color: 'var(--text-strong)',
      borderColor: 'var(--paper-50)'
    }
  }, "Kh\xE1m ph\xE1 tr\xE0"), /*#__PURE__*/React.createElement(HBtn, {
    variant: "ghost",
    iconRight: "arrow-right",
    onClick: () => go('listing'),
    style: {
      color: 'var(--paper-50)'
    }
  }, "Qu\xE0 t\u1EB7ng")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '20px 20px 4px',
      scrollbarWidth: 'none'
    }
  }, cats.slice(1).map(c => /*#__PURE__*/React.createElement(HTag, {
    key: c.value,
    onClick: () => go('listing', c.value)
  }, c.label))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '32px 20px 48px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "\u0110\u01B0\u1EE3c y\xEAu th\xEDch",
    title: "Tr\xE0 b\xE1n ch\u1EA1y",
    action: "Xem t\u1EA5t c\u1EA3",
    onAction: () => go('listing')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: '28px 16px'
    }
  }, best.map(p => /*#__PURE__*/React.createElement(HPC, {
    key: p.id,
    name: p.name,
    origin: p.origin.split(' · ')[0],
    price: priceOf(p),
    compareAt: p.compare,
    from: !p.fixed,
    tone: p.tone,
    rating: p.rating,
    reviews: p.reviews,
    badge: p.badge,
    badgeTone: p.badgeTone,
    wished: wish.includes(p.id),
    onWish: () => toggleWish(p.id),
    onClick: () => openProduct(p.id)
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-inverse)',
      padding: '44px 20px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    inverse: true,
    eyebrow: "Qu\xE0 t\u1EB7ng",
    title: "Trao g\u1EEDi t\u1EA5m l\xF2ng"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => openProduct('hop-qua'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(HPI, {
    tone: "indigo",
    ratio: "16 / 10",
    label: "\u1EA2nh h\u1ED9p qu\xE0 s\u01A1n m\xE0i"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      marginTop: 14,
      color: 'var(--paper-100)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-title)',
      fontWeight: 500,
      fontSize: 17
    }
  }, "H\u1ED9p qu\xE0 Trao G\u1EEDi"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "650.000\u20AB")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-on-inverse-muted)',
      marginTop: 4
    }
  }, "\u0110inh Sen, N\xF5n T\xF4m v\xE0 k\u1EB9o l\u1EA1c tr\xE0 xanh \xB7 k\xE8m thi\u1EC7p vi\u1EBFt tay")), /*#__PURE__*/React.createElement(HBtn, {
    variant: "accent",
    iconLeft: "gift",
    fullWidth: true,
    onClick: () => go('listing', 'qua')
  }, "Xem c\xE1c b\u1ED9 qu\xE0"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      fontWeight: 500
    }
  }, "C\xE2u chuy\u1EC7n Lam Tr\xE0"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26
    }
  }, "T\u1EEB \u0111\u1ED3i ch\xE8 T\xE2n C\u01B0\u01A1ng \u0111\u1EBFn ch\xE9n tr\xE0 nh\xE0 b\u1EA1n"), /*#__PURE__*/React.createElement(HPI, {
    tone: "green",
    ratio: "3 / 2",
    label: "\u1EA2nh \u0111\u1ED3i ch\xE8 / ng\u01B0\u1EDDi h\xE1i ch\xE8"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)'
    }
  }, "M\u1ED7i m\u1EBB tr\xE0 \u0111\u01B0\u1EE3c h\xE1i v\xE0o s\xE1ng s\u1EDBm v\xE0 sao tay trong ng\xE0y. Ch\xFAng t\xF4i ch\u1ECDn t\u1EEBng b\xFAp, \u0111\xF3ng g\xF3i nh\u1ECF \u0111\u1EC3 tr\xE0 \u0111\u1EBFn tay b\u1EA1n v\u1EABn gi\u1EEF tr\u1ECDn h\u01B0\u01A1ng c\u1ED1m.")), /*#__PURE__*/React.createElement(Footer, null));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Listing.jsx
try { (() => {
const {
  ProductCard: LPC,
  Tag: LTag,
  Input: LIn,
  Select: LSel
} = window.LamTrDesignSystem_49d071;
function ListingScreen({
  cat,
  setCat,
  openProduct,
  wish,
  toggleWish
}) {
  const {
    products,
    cats,
    priceOf
  } = window.LT_DATA;
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('pop');
  let list = products.filter(p => (cat === 'all' || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  if (sort === 'asc') list = [...list].sort((a, b) => a.base - b.base);
  if (sort === 'desc') list = [...list].sort((a, b) => b.base - a.base);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 32
    }
  }, (cats.find(c => c.value === cat) || cats[0]).label === 'Tất cả' ? 'Tất cả sản phẩm' : cats.find(c => c.value === cat).label), /*#__PURE__*/React.createElement(LIn, {
    iconLeft: "search",
    placeholder: "T\xECm tr\xE0, qu\xE0 t\u1EB7ng\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      margin: '0 -20px',
      padding: '0 20px',
      scrollbarWidth: 'none'
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(LTag, {
    key: c.value,
    selected: cat === c.value,
    onClick: () => setCat(c.value)
  }, c.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, list.length, " s\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement(LSel, {
    value: sort,
    onChange: setSort,
    style: {
      width: 170
    },
    options: [{
      value: 'pop',
      label: 'Phổ biến'
    }, {
      value: 'asc',
      label: 'Giá tăng dần'
    }, {
      value: 'desc',
      label: 'Giá giảm dần'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      gap: '28px 16px'
    }
  }, list.map(p => /*#__PURE__*/React.createElement(LPC, {
    key: p.id,
    name: p.name,
    origin: p.origin.split(' · ')[0],
    price: priceOf(p),
    compareAt: p.compare,
    from: !p.fixed,
    tone: p.tone,
    rating: p.rating,
    reviews: p.reviews,
    badge: p.badge,
    badgeTone: p.badgeTone,
    wished: wish.includes(p.id),
    onWish: () => toggleWish(p.id),
    onClick: () => openProduct(p.id)
  }))), list.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      padding: 40
    }
  }, "Ch\u01B0a t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m ph\xF9 h\u1EE3p."));
}
window.ListingScreen = ListingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Listing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Orders.jsx
try { (() => {
const {
  OrderTracker: OTr,
  Badge: OBadge,
  Tabs: OTabs,
  Button: OBtn,
  Icon: OIcon,
  ProductImage: OPI
} = window.LamTrDesignSystem_49d071;
const ofmt = window.LT_FMT;
const STAGE = [['neutral', 'Đã đặt hàng'], ['primary', 'Đã xác nhận'], ['warning', 'Đang giao'], ['success', 'Hoàn thành']];
function OrdersScreen({
  orders,
  go
}) {
  const [tab, setTab] = React.useState('all');
  const [open, setOpen] = React.useState(orders[0] && orders[0].id);
  const list = orders.filter(o => tab === 'all' || (tab === 'active' ? o.stage < 3 : o.stage === 3));
  const o = orders.find(x => x.id === open);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30
    }
  }, "\u0110\u01A1n h\xE0ng c\u1EE7a t\xF4i"), /*#__PURE__*/React.createElement(OTabs, {
    variant: "segmented",
    value: tab,
    onChange: setTab,
    items: [{
      value: 'all',
      label: 'Tất cả',
      count: orders.length
    }, {
      value: 'active',
      label: 'Đang xử lý',
      count: orders.filter(x => x.stage < 3).length
    }, {
      value: 'done',
      label: 'Hoàn thành'
    }]
  }), o && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, o.id), /*#__PURE__*/React.createElement(OBadge, {
    tone: STAGE[o.stage][0],
    dot: true
  }, STAGE[o.stage][1])), /*#__PURE__*/React.createElement(OTr, {
    current: o.stage,
    times: o.times
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56
    }
  }, /*#__PURE__*/React.createElement(OPI, {
    tone: o.tone,
    ratio: "1 / 1",
    label: " ",
    radius: "4px"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-title)',
      fontWeight: 500,
      fontSize: 15
    }
  }, o.title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 12
    }
  }, o.items, " s\u1EA3n ph\u1EA9m \xB7 ", o.pay)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, ofmt(o.total))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(OBtn, {
    variant: "secondary",
    size: "sm",
    iconLeft: "message-circle",
    fullWidth: true
  }, "Nh\u1EAFn Zalo"), o.stage === 3 ? /*#__PURE__*/React.createElement(OBtn, {
    size: "sm",
    fullWidth: true,
    iconLeft: "star"
  }, "\u0110\xE1nh gi\xE1") : /*#__PURE__*/React.createElement(OBtn, {
    size: "sm",
    variant: "ghost",
    fullWidth: true
  }, "Chi ti\u1EBFt"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, list.filter(x => x.id !== open).map(x => /*#__PURE__*/React.createElement("button", {
    key: x.id,
    type: "button",
    onClick: () => setOpen(x.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 0',
      border: 0,
      borderTop: '1px solid var(--border-hairline)',
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, x.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, x.date, " \xB7 ", ofmt(x.total))), /*#__PURE__*/React.createElement(OBadge, {
    tone: STAGE[x.stage][0],
    dot: true
  }, STAGE[x.stage][1]), /*#__PURE__*/React.createElement(OIcon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-subtle)"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20
    }
  }, "Th\xF4ng b\xE1o"), [['bell', 'Đơn ' + (o ? o.id : '') + ' đã được xác nhận', 'Lam Trà đang đóng gói đơn của bạn.', '10 phút trước'], ['truck', 'Đơn LT2398 đang được giao', 'Shipper sẽ gọi trước khi đến.', 'Hôm qua'], ['ticket-percent', 'Ưu đãi tháng 10', 'Nhập LAMTRA10 để giảm 10% cho trà sen.', '3 ngày trước']].map(([ic, t, d, w]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 18,
      background: 'var(--bg-sunken)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(OIcon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-strong)',
      fontWeight: 500
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 13
    }
  }, d)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-subtle)',
      whiteSpace: 'nowrap'
    }
  }, w)))));
}
window.OrdersScreen = OrdersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Orders.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Product.jsx
try { (() => {
const {
  ProductImage: PPI,
  Price: PPrice,
  Rating: PRating,
  OptionPicker: POpt,
  QuantityStepper: PQty,
  Button: PBtn,
  IconButton: PIB,
  Tabs: PTabs,
  Badge: PBadge,
  Icon: PIcon
} = window.LamTrDesignSystem_49d071;
function ProductScreen({
  id,
  addToCart,
  wish,
  toggleWish
}) {
  const {
    products,
    priceOf,
    reviews
  } = window.LT_DATA;
  const p = products.find(x => x.id === id) || products[0];
  const [size, setSize] = React.useState('150');
  const [grade, setGrade] = React.useState('1');
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('Mô tả');
  const [img, setImg] = React.useState(0);
  const price = priceOf(p, size, grade);
  const compare = p.compare ? Math.round(p.compare * (price / p.base)) : undefined;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(PPI, {
    tone: p.tone,
    ratio: "1 / 1",
    radius: "0",
    label: " "
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 14,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 6
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    onClick: () => setImg(i),
    style: {
      width: i === img ? 18 : 6,
      height: 6,
      borderRadius: 3,
      background: i === img ? 'var(--text-strong)' : 'rgba(36,32,28,.25)',
      cursor: 'pointer',
      transition: 'width var(--dur-base)'
    }
  }))), p.badge && /*#__PURE__*/React.createElement(PBadge, {
    tone: p.badgeTone || 'inverse',
    style: {
      position: 'absolute',
      top: 14,
      left: 14
    }
  }, p.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, p.origin), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      flex: 1,
      fontSize: 30
    }
  }, p.name), /*#__PURE__*/React.createElement(PIB, {
    icon: "share-2",
    label: "Chia s\u1EBB",
    size: 40
  })), /*#__PURE__*/React.createElement(PRating, {
    value: p.rating,
    count: p.reviews
  }), /*#__PURE__*/React.createElement(PPrice, {
    value: price,
    compareAt: compare,
    size: "lg",
    style: {
      marginTop: 4
    }
  })), !p.fixed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 20px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(POpt, {
    label: "Kh\u1ED1i l\u01B0\u1EE3ng",
    value: size,
    onChange: setSize,
    options: [{
      value: '150',
      label: '150g'
    }, {
      value: '300',
      label: '300g'
    }, {
      value: '500',
      label: '500g'
    }]
  }), /*#__PURE__*/React.createElement(POpt, {
    label: "Ph\xE2n h\u1EA1ng",
    value: grade,
    onChange: setGrade,
    options: [{
      value: '1',
      label: 'Hạng 1',
      sub: 'Búp non, đều cánh'
    }, {
      value: '2',
      label: 'Hạng 2',
      sub: 'Uống hằng ngày'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(PQty, {
    value: qty,
    onChange: setQty
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--success)',
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "check",
    size: 16
  }), "C\xF2n h\xE0ng \xB7 giao 2\u20134 ng\xE0y")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 0',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(PIB, {
    icon: "heart",
    label: "Y\xEAu th\xEDch",
    variant: "outline",
    size: 52,
    active: wish.includes(p.id),
    onClick: () => toggleWish(p.id),
    style: {
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement(PBtn, {
    size: "lg",
    fullWidth: true,
    iconLeft: "shopping-bag",
    onClick: () => addToCart({
      id: p.id,
      size: p.fixed ? null : size,
      grade: p.fixed ? null : grade,
      qty,
      price
    })
  }, "Th\xEAm v\xE0o gi\u1ECF")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '24px 20px 0',
      padding: '14px 16px',
      background: 'var(--accent-soft)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 13,
      color: 'var(--tra-700)',
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    name: "gift",
    size: 18
  }), "G\xF3i qu\xE0 k\xE8m thi\u1EC7p mi\u1EC5n ph\xED cho \u0111\u01A1n t\u1EEB 500.000\u20AB"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 20px 0'
    }
  }, /*#__PURE__*/React.createElement(PTabs, {
    items: ['Mô tả', 'Cách pha', 'Đánh giá'],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 18,
      fontSize: 15,
      lineHeight: 1.65
    }
  }, tab === 'Mô tả' && /*#__PURE__*/React.createElement("p", null, p.desc), tab === 'Cách pha' && /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("li", null, "Tr\xE1ng \u1EA5m ch\xE9n b\u1EB1ng n\u01B0\u1EDBc s\xF4i."), /*#__PURE__*/React.createElement("li", null, "Cho 5\u20137g tr\xE0 v\xE0o \u1EA5m 150ml."), /*#__PURE__*/React.createElement("li", null, "R\xF3t n\u01B0\u1EDBc 80\u201385\xB0C, \u0111\xE1nh th\u1EE9c tr\xE0 5 gi\xE2y r\u1ED3i b\u1ECF n\u01B0\u1EDBc \u0111\u1EA7u."), /*#__PURE__*/React.createElement("li", null, "H\xE3m 30\u201345 gi\xE2y cho n\u01B0\u1EDBc th\u1EE9 nh\u1EA5t, t\u0103ng d\u1EA7n \u1EDF c\xE1c n\u01B0\u1EDBc sau.")), tab === 'Đánh giá' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, reviews.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      paddingBottom: 16,
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, r.name), /*#__PURE__*/React.createElement(PRating, {
    value: r.stars,
    size: 12
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 12,
      color: 'var(--text-subtle)'
    }
  }, r.date)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14
    }
  }, r.text))), /*#__PURE__*/React.createElement(PBtn, {
    variant: "secondary"
  }, "Vi\u1EBFt \u0111\xE1nh gi\xE1")))));
}
window.ProductScreen = ProductScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Product.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
// Sample catalogue for the Lam Trà storefront UI kit. Prices are illustrative.
window.LT_DATA = (() => {
  const products = [{
    id: 'dinh-sen',
    name: 'Trà Đinh Sen',
    origin: 'Tân Cương · Thái Nguyên',
    cat: 'sen',
    base: 320000,
    tone: 'lotus',
    rating: 4.9,
    reviews: 88,
    badge: 'Bán chạy',
    desc: 'Búp Đinh non ướp cùng gạo sen Tây Hồ theo lối xưa, mỗi cân trà cần hơn nghìn bông sen. Nước vàng sánh, hương sen dịu, hậu ngọt kéo dài.'
  }, {
    id: 'moc-cau',
    name: 'Trà Móc Câu',
    origin: 'Tân Cương · Thái Nguyên',
    cat: 'xanh',
    base: 150000,
    tone: 'green',
    rating: 4.7,
    reviews: 142,
    desc: 'Cánh trà xoăn nhỏ như móc câu, sao tay trên chảo gang. Vị chát dịu, hương cốm non, hợp uống hằng ngày.'
  }, {
    id: 'non-tom',
    name: 'Trà Nõn Tôm',
    origin: 'Tân Cương · Thái Nguyên',
    cat: 'xanh',
    base: 220000,
    tone: 'green',
    rating: 4.8,
    reviews: 64,
    desc: 'Chỉ hái một tôm một lá. Nước xanh trong, vị thanh, hậu ngọt rõ.'
  }, {
    id: 'dinh-th',
    name: 'Đinh Thượng Hạng',
    origin: 'Tân Cương · Thái Nguyên',
    cat: 'xanh',
    base: 480000,
    tone: 'matcha',
    rating: 5.0,
    reviews: 31,
    badge: 'Thượng hạng',
    desc: 'Phần búp nhỏ nhất của cây chè, cánh nhọn như đinh. Dành cho người sành trà và những dịp đặc biệt.'
  }, {
    id: 'olong-sen-do',
    name: 'Ô long sen đỏ',
    origin: 'Lâm Đồng',
    cat: 'olong',
    base: 255000,
    compare: 300000,
    tone: 'amber',
    rating: 4.6,
    reviews: 40,
    badge: '-15%',
    badgeTone: 'sale',
    desc: 'Ô long lên men nhẹ ướp sen đỏ, hương mật ong và hoa chín.'
  }, {
    id: 'lai',
    name: 'Trà lài',
    origin: 'Thái Nguyên',
    cat: 'lai',
    base: 135000,
    tone: 'jasmine',
    rating: 4.7,
    reviews: 97,
    desc: 'Trà xanh ướp hoa nhài tươi, thơm dịu, dễ uống.'
  }, {
    id: 'matcha',
    name: 'Bột matcha',
    origin: 'Thái Nguyên',
    cat: 'matcha',
    base: 190000,
    tone: 'matcha',
    rating: 4.5,
    reviews: 22,
    desc: 'Bột trà xanh nghiền mịn, dùng pha latte hoặc làm bánh.'
  }, {
    id: 'hop-qua',
    name: 'Hộp quà Trao Gửi',
    origin: 'Bộ quà tặng',
    cat: 'qua',
    base: 650000,
    tone: 'indigo',
    rating: 4.9,
    reviews: 53,
    badge: 'Quà tặng',
    badgeTone: 'accent',
    fixed: true,
    desc: 'Đinh Sen 150g, Nõn Tôm 150g và kẹo lạc trà xanh trong hộp sơn mài, kèm thiệp viết tay.'
  }];
  const cats = [{
    value: 'all',
    label: 'Tất cả'
  }, {
    value: 'xanh',
    label: 'Trà xanh'
  }, {
    value: 'sen',
    label: 'Trà sen'
  }, {
    value: 'olong',
    label: 'Ô long'
  }, {
    value: 'lai',
    label: 'Trà lài'
  }, {
    value: 'matcha',
    label: 'Matcha'
  }, {
    value: 'qua',
    label: 'Quà tặng'
  }];
  const SIZE_MULT = {
    '150': 1,
    '300': 1.9,
    '500': 3
  };
  const GRADE_MULT = {
    '1': 1,
    '2': 0.75
  };
  const priceOf = (p, size = '150', grade = '1') => p.fixed ? p.base : Math.round(p.base * SIZE_MULT[size] * GRADE_MULT[grade] / 1000) * 1000;
  const reviews = [{
    name: 'Chị Hạnh',
    stars: 5,
    date: '12/10/2026',
    text: 'Trà thơm đúng mùi sen, đóng gói cẩn thận. Mua biếu bố mẹ, ông bà rất thích.'
  }, {
    name: 'Anh Tuấn',
    stars: 5,
    date: '03/10/2026',
    text: 'Nước pha đến lần thứ tư vẫn còn ngọt. Giao nhanh, có nhắn Zalo xác nhận.'
  }, {
    name: 'Minh Thư',
    stars: 4,
    date: '28/09/2026',
    text: 'Hương dịu, hợp uống buổi sáng. Mong có thêm hộp nhỏ 100g.'
  }];
  return {
    products,
    cats,
    priceOf,
    reviews
  };
})();
window.LT_FMT = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

__ds_ns.OrderTracker = __ds_scope.OrderTracker;

__ds_ns.Price = __ds_scope.Price;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.ProductImage = __ds_scope.ProductImage;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ICON_PATHS = __ds_scope.ICON_PATHS;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.OptionPicker = __ds_scope.OptionPicker;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
