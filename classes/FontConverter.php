<?php

declare(strict_types=1);

namespace SpAnjaan\NepaliUnicode\Classes;

/**
 * Class FontConverter
 *
 * Converts text between Preeti and Hisab Nepali fonts (ASCII mapping only).
 * Only keyboard characters are mapped. Numbers and shifted keys are converted,
 * all other characters remain unchanged.
 */
final class FontConverter
{
    /**
     * Preeti → Hisab ASCII mapping.
     *
     * @var array<string, string>
     */
    protected static array $preetiToHisab = [
        '!' => '1',
        '@' => '2',
        '#' => '3',
        '$' => '4',
        '%' => '5',
        '^' => '6',
        '&' => '7',
        '*' => '8',
        '(' => '9',
        ')' => '0',
        '1' => '!',
        '2' => '@',
        '3' => '#',
        '4' => '$',
        '5' => '%',
        '6' => '^',
        '7' => '&',
        '8' => '*',
        '9' => '(',
        '0' => ')',
    ];

    /**
     * Hisab → Preeti ASCII mapping.
     *
     * @var array<string, string>
     */
    protected static array $hisabToPreeti = [
        '1' => '!',
        '2' => '@',
        '3' => '#',
        '4' => '$',
        '5' => '%',
        '6' => '^',
        '7' => '&',
        '8' => '*',
        '9' => '(',
        '0' => ')',
        '!' => '1',
        '@' => '2',
        '#' => '3',
        '$' => '4',
        '%' => '5',
        '^' => '6',
        '&' => '7',
        '*' => '8',
        '(' => '9',
        ')' => '0',
    ];

    /**
     * Convert Preeti ASCII text to Hisab ASCII.
     *
     * @param string $text
     * @return string
     */
    public static function preetiToHisab(string $text): string
    {
        return strtr($text, self::$preetiToHisab);
    }

    /**
     * Convert Hisab ASCII text to Preeti ASCII.
     *
     * @param string $text
     * @return string
     */
    public static function hisabToPreeti(string $text): string
    {
        return strtr($text, self::$hisabToPreeti);
    }
}
