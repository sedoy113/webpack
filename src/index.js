import './pages/index.scss';
// Импортируем все SVG из папки icons
const iconsContext = require.context('./icons', false, /\.svg$/);
iconsContext.keys().forEach(iconsContext);
import './images/logo.svg';
import './images/avatar.jpg';
import './images/edit-avatar-icon.svg';
import './components/card.js';

