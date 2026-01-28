import React from 'react';
import { View, StyleSheet } from 'react-native';

const COLOR_PALETTE = {
    '.': 'transparent',
    'r': '#FF0044', // Red
    'o': '#FF7700', // Orange
    'y': '#FFCC00', // Yellow
    'g': '#FFD700', // Gold
    's': '#FFEEAA', // Shine/Silver
    'c': '#C0C0C0', // Silver/Chrome (Bit Body)
    't': '#0088AA', // Teal (Bit Panels)
    'l': '#00FF00', // Lime/Green (Bit Screen)
    'b': '#000000', // Black
    'f': '#00AAFF', // Blue Thruster
    'w': '#FFFFFF', // White
};

const ICONS = {
    heart: [
        "                ",
        "  .rr.    .rr.  ",
        " .rrrr.  .rrrr. ",
        ".rrrrrr..rrrrrr.",
        ".rrrrrrrrrrrrrr.",
        ".rrrrrrrrrrrrrr.",
        ".rrrrrrrrrrrrrr.",
        " .rrrrrrrrrrrr. ",
        "  .rrrrrrrrrr.  ",
        "   .rrrrrrrr.   ",
        "    .rrrrrr.    ",
        "     .rrrr.     ",
        "      .rr.      ",
        "       ..       ",
        "                ",
        "                "
    ],
    streak: [ // Flame
        "       .        ",
        "      .o.       ",
        "     .ooo.      ",
        "    .oyyo.      ",
        "   .oyyyyo.     ",
        "   .yyyyyy.     ",
        "  .oyyyyyyo.    ",
        " .ooyyyyyyoo.   ",
        " .oooyyyyooo.   ",
        " .oooooyoooo.   ",
        "  .oooooooo.    ",
        "   .oooooo.     ",
        "    ..oo..      ",
        "      ..        ",
        "                ",
        "                "
    ],
    currency: [ // Coin
        "      ....      ",
        "    ..gggg..    ",
        "   .gggggggg.   ",
        "  .gggggggggg.  ",
        " .gggsggsggggg. ",
        " .gggsggsggggg. ",
        " .gggggggggggg. ",
        " .gggggggggggg. ",
        " .gggggggggggg. ",
        " .gggggggggggg. ",
        " .gggsggsggggg. ",
        " .gggsggsggggg. ",
        "  .gggggggggg.  ",
        "   .gggggggg.   ",
        "    ..gggg..    ",
        "      ....      "
    ],
    bit: [ // Calculator Droid (Single Antenna, Green Screen Face)
        "       .        ",
        "       c        ", // Antenna (c = silver)
        "  ..........    ",
        " .cccccccccc.   ",
        ".cccccccccccc.  ",
        ".ccllllllllc.   ", // Screen Start (l = green)
        ".cl..ll..llc.   ", // Eyes (using dots)
        ".cl..ll..llc.   ",
        ".ccllllllllc.   ",
        ".ccl.bbbb.lc.   ", // Smile
        ".ccllllllllc.   ", // Screen End
        ".ccttttttttc.   ", // Bottom Panel (Teal)
        " .cccccccccc.   ",
        "   .fffffff.    ", // Thruster
        "    .......     "
    ]
};

const PixelIcon = ({ name, size = 24, style }) => {
    const pixelMap = ICONS[name];
    if (!pixelMap) return null;

    const pixelSize = size / 16;

    return (
        <View style={[{ width: size, height: size }, style]}>
            {pixelMap.map((row, y) => (
                <View key={y} style={{ flexDirection: 'row', height: pixelSize }}>
                    {row.split('').map((char, x) => (
                        <View
                            key={x}
                            style={{
                                width: pixelSize,
                                height: pixelSize,
                                backgroundColor: COLOR_PALETTE[char] || 'transparent'
                            }}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

export default PixelIcon;
