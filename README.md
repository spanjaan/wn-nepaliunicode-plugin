# Nepali Unicode Plugin for WinterCMS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Nepali Unicode plugin for WinterCMS provides a powerful and user-friendly way to convert Nepali text between different font encodings. It supports conversion from **Preeti** and **Hisab** fonts to standard **Nepali Unicode**, as well as conversion between Preeti and Hisab fonts.

---

## Features

- **Multiple Font Support**
  - Convert from Preeti to Unicode
  - Convert from Hisab to Unicode
  - Convert between Preeti and Hisab fonts
  - Preserve formatting and special characters

- **User-Friendly Interface**
  - Clean, responsive design
  - Tailwind css for frontend
  - Real-time conversion
  - Copy-to-clipboard functionality
  - Clear text option
  - Dark mode support

- **Flexible Configuration**
  - Customizable default input font
  - Configurable output format
  - Easy integration with any CMS page

- **Robust Implementation**
  - Full character mapping support
  - Post-processing rules for accurate conversion
  - Error handling and input validation
  - Cross-browser compatible

---

## Installation

### Using Composer (Recommended)

```bash
cd /path/to/your/wintercms
composer require spanjaan/wn-nepaliunicode-plugin
````

### Manual Installation

```bash
git clone https://github.com/spanjaan/wn-nepaliunicode-plugin.git
```

Move the plugin folder to:

```
/plugins/spanjaan/nepaliunicode
```

---

## Usage

### Adding the Converter to a CMS Page

1. Open your CMS page in the Winter CMS backend.
2. Add the component to your page:

```ini
[unicodeConverter]
```

3. Place the component in your page content:

```twig
{% component 'unicodeConverter' %}
```

### Component Configuration

The Unicode Converter component can be configured with the following properties:

| Property          | Description             | Default | Options                |
| ----------------- | ----------------------- | ------- | ---------------------- |
| defaultInputFont  | Default font for input  | preeti  | preeti, hisab          |
| defaultOutputFont | Default font for output | unicode | unicode, preeti, hisab |

Example configuration:

```ini
[unicodeConverter]
defaultInputFont = "preeti"
defaultOutputFont = "unicode"
```

### Using the Converter

1. **Input Text**: Type or paste text in either Preeti or Hisab font.
2. **Select Fonts**: Choose input and output font types from the dropdowns.
3. **Convert**: Text is converted automatically as you type.
4. **Copy Results**: Click the copy button to copy the converted text.

### Supported Conversions

* Preeti → Unicode
* Hisab → Unicode
* Preeti → Hisab
* Hisab → Preeti

---

## Advanced Usage

### CSS Classes

The component uses the following font classes:

* `.font-preeti` - For Preeti font text
* `.font-hisab` - For Hisab font text
* `.font-unicode` - For Unicode text

### Event Handlers

The component includes the following AJAX handlers:

* `onConvert` - Handles text conversion
* `onChangeInputFont` - Updates input font
* `onChangeOutputFont` - Updates output font
* `onCopy` - Handles copy to clipboard
* `onClear` - Clears input text

---

## Browser Support

* Chrome (latest)
* Firefox (latest)
* Safari (latest)
* Edge (latest)
* Opera (latest)

---

## Support

* GitHub Issues: [https://github.com/spanjaan/wn-nepaliunicode-plugin/issues](https://github.com/spanjaan/wn-nepaliunicode-plugin/issues)
* Source Code: [https://github.com/spanjaan/wn-nepaliunicode-plugin](https://github.com/spanjaan/wn-nepaliunicode-plugin)

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Write tests for new features.
4. Submit a Pull Request.

Please follow these coding standards:

* PSR-12 coding style
* PHPDoc blocks for all classes and methods
* Meaningful variable and function names
* Clear commit messages

---

## License

MIT License © Sudarshan Pudasaini
[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

This plugin is provided as-is without any warranty. Use at your own risk.
