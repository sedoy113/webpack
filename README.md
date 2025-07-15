# Webpack Frontend

![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![Babel](https://img.shields.io/badge/Babel-F9DC3e?style=for-the-badge&logo=babel&logoColor=black)

Полнофункциональная сборка для современного фронтенд-разработчика с поддержкой всех основных технологий.

## 🌟 Основные возможности

### 🔧 Режимы сборки

- \*\*Development режим\*\*:
- Быстрая сборка с `eval-source-map`
- Hot Module Replacement (HMR)
- Отслеживание изменений файлов (`watchFiles`)

- \*\*Production режим\*\*:
- Оптимизированная сборка с `source-map`
- Минификация CSS/HTML
- Добавление хэшей к именам файлов (`[contenthash]`)

### 🛠 Обработка ресурсов

| Тип ресурсов | Особенности обработки |

\|--------------------|-----------------------------------------------|

| JavaScript | Babel + кеширование |

| HTML | Автоматическое подключение ресурсов |

| SVG (иконки) | Сборка в спрайты + оптимизация (svgo) |

| Изображения | Копирование в `/images` |

| Шрифты | Копирование в `/fonts` |

| Стили (SCSS/CSS) | Автопрефиксер + минификация + source maps |

## ⚙️ Детали конфигурации

### 📂 Структура выходных файлов

build/

├── css/

│ ├── main.[hash].css

│ └── styles.[hash].css

├── js/

│ ├── main.[hash].js

│ └── vendors.[hash].js

├── images/

├── fonts/

└── index.html

## 🚀 Быстрый старт

### Установка

```bash
npm install
```

Development режим

```bash
npm run dev
```

Открывает http://localhost:8080 с горячей перезагрузкой.

Production сборка

```bash
npm run build
```

## 🎯 Особые фичи

### Алиасы для путей:

javascript

'@': path.resolve(\_\_dirname, 'src/')

'@images': path.resolve(\_\_dirname, 'src/images')

### Умные publicPath:

javascript

publicPath: isProduction ? './' : '/'

### Продвинутая обработка SCSS:

Автоматическое подключение миксинов/переменных

Поддержка всех встроенных модулей Sass
