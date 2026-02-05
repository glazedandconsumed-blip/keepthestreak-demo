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
    ],
    trophy: [
        "                ",
        "  .yyyyyyyyyy.  ",
        " .yyyyyyyyyyyy. ",
        " .yy..yyyy..yy. ",
        " .yy..yyyy..yy. ",
        "  ..yyyyyyyy..  ",
        "   .yyyyyyyy.   ",
        "    .yyyyyy.    ",
        "     .yyyy.     ",
        "      .yy.      ",
        "      .yy.      ",
        "      .yy.      ",
        "     .yyyy.     ",
        "    .yyyyyy.    ",
        "                ",
        "                "
    ],
    ruler: [ // Slide Rule
        "                ",
        "                ",
        "                ",
        " .cccccccccccc. ",
        " .c.c.c.c.c.c.c ", // Ticks
        " .cccccccccccc. ",
        " .c.c.c.cyc.c.c ", // Slider (yellow)
        " .cccccccccccc. ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                "
    ],
    watch: [ // Calculator Watch
        "      ....      ",
        "     .bbbb.     ",
        "    .b....b.    ",
        "   .b.cccc.b.   ",
        "   .b.cllc.b.   ", // Screen
        "   .b.cccc.b.   ",
        "   .b.bbbb.b.   ", // Buttons
        "   .b.bbbb.b.   ",
        "   .b......b.   ",
        "    .b....b.    ",
        "     .bbbb.     ",
        "      ....      ",
        "                ",
        "                ",
        "                ",
        "                "
    ],
    server: [ // Mainframe / Server
        "  .cccccccccc.  ",
        "  .c........c.  ",
        "  .c.r.g.y.bc.  ", // Blinkin lights
        "  .c........c.  ",
        "  .cccccccccc.  ",
        "  .c........c.  ",
        "  .c.bbbbbbbc.  ", // Tape drives?
        "  .c.bbbbbbbc.  ",
        "  .c........c.  ",
        "  .cccccccccc.  ",
        "  .c........c.  ",
        "  .c.gggggggc.  ",
        "  .c........c.  ",
        "  .cccccccccc.  ",
        "                ",
        "                "
    ],
    chip: [ // Generic Component (Green PCB)
        "                ",
        "  .cccccccccc.  ",
        " .cggggggggggc. ",
        " .cgllgllgllgc. ",
        " .cgllgllgllgc. ",
        " .cggggggggggc. ",
        " .cgllgllgllgc. ",
        " .cgllgllgllgc. ",
        " .cggggggggggc. ",
        " .cgllgllgllgc. ",
        " .cgllgllgllgc. ",
        " .cggggggggggc. ",
        "  .cccccccccc.  ",
        "                ",
        "                ",
        "                "
    ],
    fan: [ // Cooling Fan
        "      ....      ",
        "    ..cccc..    ",
        "   .cc....cc.   ",
        "  .c..cccc..c.  ",
        " .c.cc....cc.c. ",
        " .c.c......c.c. ",
        " .c.cc....cc.c. ",
        " .c...cccc...c. ",
        " .c.cc....cc.c. ",
        " .c.c......c.c. ",
        " .c.cc....cc.c. ",
        "  .c..cccc..c.  ",
        "   .cc....cc.   ",
        "    ..cccc..    ",
        "      ....      "
    ],
    memory: [ // RAM Stick
        "                ",
        " .gggggggggggg. ",
        " .gccccccccccg. ",
        " .gc..c..c..cg. ",
        " .gc..c..c..cg. ",
        " .gccccccccccg. ",
        " .gy.y.y.y.y.yg. ", // Gold contacts
        " .gggggggggggg. ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                "
    ],
    save: [ // Floppy Disk
        "  .bbbbbbbbbb.  ",
        "  .b........b.  ",
        "  .b.ccccc..b.  ", // Shutter
        "  .b.ccccc..b.  ",
        "  .b.ccccc..b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .b........b.  ",
        "  .bbbbbbbbbb.  ",
        "                ",
        "                "
    ],
    cpu: [ // Processor
        "  .cccccccccc.  ",
        " .cggggggggggc. ",
        " .cg........gc. ",
        " .cg.bbbbbb.gc. ",
        " .cg.bbbbbb.gc. ",
        " .cg.bbbbbb.gc. ",
        " .cg.bbbbbb.gc. ",
        " .cg.bbbbbb.gc. ",
        " .cg.bbbbbb.gc. ",
        " .cg........gc. ",
        " .cggggggggggc. ",
        "  .cccccccccc.  ",
        "   .y.y.y.y.    ", // Pins
        "                ",
        "                ",
        "                "
    ],
    hdd: [ // Hard Drive
        "  .cccccccccc.  ",
        "  .c........c.  ",
        "  .c.cccccc.c.  ", // Platter
        "  .c.cccccc.c.  ",
        "  .c.cccccc.c.  ",
        "  .c.cccccc.c.  ",
        "  .c........c.  ",
        "  .c.gg.....c.  ", // Circuit board
        "  .c.gg.....c.  ",
        "  .c........c.  ",
        "  .cccccccccc.  ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                "
    ],
    gpu: [ // Graphics Card (Voodoo)
        " .gggggggggggg. ",
        " .g..........g. ",
        " .g.bbbb.bbbb.g. ", // Chips
        " .g.bbbb.bbbb.g. ",
        " .g..........g. ",
        " .g.cccc.cccc.g. ", // Fans
        " .g.cccc.cccc.g. ",
        " .g..........g. ",
        " .gggggggggggg. ",
        "      .y.       ", // Connector
        "      .y.       ",
        "                ",
        "                ",
        "                ",
        "                "
    ],
    snowflake: [ // Cryo Freeze
        "       .        ",
        "      .f.       ",
        "       .        ",
        "   .   f   .    ",
        "    .f.f.f.     ",
        "  .....f.....   ",
        " .fffff.fffff.  ",
        "      .f.       ",
        "    .f.f.f.     ",
        "   .   f   .    ",
        "       .        ",
        "      .f.       ",
        "       .        ",
        "                ",
        "                ",
        "                "
    ],
    key: [ // Hint / Cheat Code
        "                ",
        "      ....      ",
        "     .yyyy.     ",
        "    .y....y.    ",
        "    .y.  .y.    ",
        "    .y....y.    ",
        "     .yyyy.     ",
        "      .yy.      ",
        "      .yy.      ",
        "      .yy.      ",
        "      .yy.      ",
        "     .yyyy.     ",
        "      .yy.      ",
        "                ",
        "                ",
        "                "
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
