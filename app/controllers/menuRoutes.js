// Centralized menu routes definition
// Use Map to preserve order and stable keys
const menuRoutes = new Map([
  ['home',   { label: '首頁', href: '#' }],
  ['about',  { label: '關於', href: '#about' }],
  ['github', { label: 'GitHub', href: 'https://github.com', target: '_blank' }],
]);

export default menuRoutes;

