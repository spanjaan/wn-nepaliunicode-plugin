<?php

namespace SpAnjaan\NepaliUnicode\Components;

use SpAnjaan\NepaliUnicode\Classes\HisabConverter;
use SpAnjaan\NepaliUnicode\Classes\PreetiConverter;
use SpAnjaan\NepaliUnicode\Classes\FontConverter;
use Cms\Classes\ComponentBase;
use Illuminate\Support\Facades\Input;

/**
 * Class UnicodeConverter
 *
 * Converts text between Preeti and Hisab Nepali fonts (ASCII)
 * or to Unicode using Preeti/Hisab converters.
 */
class UnicodeConverter extends ComponentBase
{
    /**
     * Component details
     *
     * @return array<string, string>
     */
    public function componentDetails(): array
    {
        return [
            'name'        => 'Unicode Converter',
            'description' => 'Converts Preeti and Hisab Nepali fonts to Unicode or between each other.'
        ];
    }

    /**
     * Define component properties
     *
     * @return array<string, array<string, mixed>>
     */
    public function defineProperties(): array
    {
        return [
            'defaultInputFont' => [
                'title'       => 'Default Input Font',
                'description' => 'Default font for the input field.',
                'type'        => 'dropdown',
                'default'     => 'preeti',
                'options'     => [
                    'preeti' => 'Preeti',
                    'hisab'  => 'Hisab'
                ]
            ],
            'defaultOutputFont' => [
                'title'       => 'Default Output Font',
                'description' => 'Choose which font to output.',
                'type'        => 'dropdown',
                'default'     => 'unicode',
                'options'     => [
                    'unicode' => 'Unicode',
                    'preeti'  => 'Preeti',
                    'hisab'   => 'Hisab'
                ]
            ]
        ];
    }

    /**
     * Called when the component runs on page
     *
     * @return void
     */
    public function onRun(): void
    {
        $this->addJs('/plugins/spanjaan/nepaliunicode/assets/js/app.js');
        $this->addCss('/plugins/spanjaan/nepaliunicode/assets/css/app.css');

        $this->page['defaultInputFont'] = $this->property('defaultInputFont', 'preeti');
        $this->page['defaultOutputFont'] = $this->property('defaultOutputFont', 'unicode');
    }

    /**
     * AJAX handler for text conversion
     *
     * @return array<string, mixed>
     * @throws \InvalidArgumentException If input or output font is invalid
     */
    public function onConvert(): array
    {
        $text = strip_tags(Input::post('input_text', ''));
        $inputFont = strtolower(Input::post('input_font', $this->property('defaultInputFont', 'preeti')));
        $outputFont = strtolower(Input::post('output_font', $this->property('defaultOutputFont', 'unicode')));

        // Validate input and output fonts
        $validFonts = ['preeti', 'hisab', 'unicode'];
        if (!in_array($inputFont, ['preeti', 'hisab']) || !in_array($outputFont, $validFonts)) {
            throw new \InvalidArgumentException('Invalid input or output font selected.');
        }

        $result = $text;

        // Convert only if input and output fonts differ
        if ($inputFont !== $outputFont) {
            if ($inputFont === 'preeti') {
                if ($outputFont === 'unicode') {
                    $result = PreetiConverter::convert($text);
                } elseif ($outputFont === 'hisab') {
                    $result = FontConverter::preetiToHisab($text);
                }
            } elseif ($inputFont === 'hisab') {
                if ($outputFont === 'unicode') {
                    $result = HisabConverter::convert($text);
                } elseif ($outputFont === 'preeti') {
                    $result = FontConverter::hisabToPreeti($text);
                }
            }
        }

        return [
            '#unicodeResult' => ['value' => $result], // Object with 'value' key to match JS expectation
            'outputFont' => $outputFont // Sync font select in JS
        ];
    }

    /**
     * Returns font options for dropdowns
     *
     * @return array<string, string>
     */
    public function fontOptions(): array
    {
        return [
            'preeti'  => 'Preeti',
            'hisab'   => 'Hisab',
            'unicode' => 'Unicode'
        ];
    }
}