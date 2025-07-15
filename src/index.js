import './styles/main.scss';

// Импортируем все SVG из папки icons
const iconsContext = require.context('./icons', false, /\.svg$/);
iconsContext.keys().forEach(iconsContext);
import './components/card.js';

