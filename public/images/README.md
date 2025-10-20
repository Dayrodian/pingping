# 📁 Структура изображений

## Hero секция (`/images/hero/`)
Изображения для первого экрана:
- `game-preview.png` - Основное превью игры (рекомендуемый размер: 800x1400px, aspect 9:16)
- `chicken-character.png` - Курочка отдельно (опционально)
- `background.png` - Фон для превью (опционально)

## Галерея (`/images/gallery/`)
Превью для плейблов (17 примеров):

### Готовые:
- ✅ `preview_1.png` - Chicken Road Classic
- ✅ `preview_2.png` - Chicken Road v2
- ✅ `Preview_3.png` - Chicken Road Pro
- ✅ `preview_4.png` - Chicken Road Plus
- ✅ `Preview_5.png` - Chicken Road Deluxe

### Нужно добавить (см. PREVIEW_PROMPTS.md):
- ⏳ `preview_6.png` - Chicken Road Casino (1:1)
- ⏳ `preview_7.png` - Chicken Road Multipliers (1:1)
- ⏳ `preview_8.png` - Chicken Road Crossy (1:1)
- ⏳ `preview_9.png` - Chicken Road Rocket (9:16)
- ⏳ `preview_10.png` - Chicken Road Sneakers (9:16)
- ⏳ `preview_11.png` - Chicken Road Fortune (9:16)
- ⏳ `preview_12.png` - Chicken Road Online (9:16)
- ⏳ `preview_13.png` - Chicken Road Extreme (9:16)
- ⏳ `preview_14.png` - Chicken Road Bonus (9:16)
- ⏳ `preview_15.png` - Chicken Road Biker (9:16)
- ⏳ `preview_16.png` - Chicken Road Midnight (9:16)
- ⏳ `preview_17.png` - Chicken Road 2 Maid (9:16)

**Размеры:**
- Preview #1-8: 1:1 ratio (квадрат, 800x800px)
- Preview #9-17: 9:16 ratio (вертикальный, 1080x1920px)

**Документация:** См. `gallery/PREVIEW_PROMPTS.md` для промптов генерации

## Возможности (`/images/features/`)
Иконки/изображения для секции возможностей:
- `customization.png`
- `characters.png`
- `colors.png`
- и т.д.

## Форматы
- PNG - для изображений с прозрачностью
- JPG - для фотографий/скриншотов
- WebP - для оптимизации (Vite может конвертировать автоматически)

## Использование в коде
```html
<!-- Простая ссылка -->
<img src="/images/hero/game-preview.png" alt="Game Preview" />

<!-- С адаптивностью -->
<picture>
  <source srcset="/images/hero/game-preview.webp" type="image/webp" />
  <img src="/images/hero/game-preview.png" alt="Game Preview" />
</picture>
```


