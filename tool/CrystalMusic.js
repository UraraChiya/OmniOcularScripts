/* 基础定义与映射 */
let PITCH = {
    C4: 36, D4: 38, E4: 40, F4: 41, G4: 43, A4: 45, B4: 47,
    C5: 48, D5: 50, E5: 52, F5: 53, G5: 55, A5: 57, C6: 60
};

// let crystals = [
//     { id: 0, name: 'Black', base: PITCH.C4, minor: false },
//     { id: 1, name: 'Red', base: PITCH.G4, minor: false },
//     { id: 2, name: 'Green', base: PITCH.F4, minor: true },
//     { id: 3, name: 'Brown', base: PITCH.D4, minor: false },
//     { id: 4, name: 'Blue', base: PITCH.E4, minor: false },
//     { id: 5, name: 'Purple', base: PITCH.A4, minor: false },
//     { id: 6, name: 'Cyan', base: PITCH.A4, minor: true },
//     { id: 7, name: 'LightGray', base: PITCH.D5, minor: true },
//     { id: 8, name: 'Gray', base: PITCH.C5, minor: true },
//     { id: 9, name: 'Pink', base: PITCH.F5, minor: false },
//     { id: 10, name: 'Lime', base: PITCH.E5, minor: false },
//     { id: 11, name: 'Yellow', base: PITCH.G5, minor: false },
//     { id: 12, name: 'LightBlue', base: PITCH.A5, minor: false },
//     { id: 13, name: 'Magenta', base: PITCH.B4, minor: false },
//     { id: 14, name: 'Orange', base: PITCH.E4, minor: true },
//     { id: 15, name: 'White', base: PITCH.C6, minor: false }
// ];

const CRYSTALS = {
    Black: 0,
    Red: 1,
    Green: 2,
    Brown: 3,
    Blue: 4,
    Purple: 5,
    Cyan: 6,
    LightGray: 7,
    Gray: 8,
    Pink: 9,
    Lime: 10,
    Yellow: 11,
    LightBlue: 12,
    Magenta: 13,
    Orange: 14,
    White: 15,
}

// /* 生成和弦表 */
// let tableData = crystals.map(function (crystal) {
//     let thirdInterval = crystal.minor ? 3 : 4; // 小三度为3，大三度为4

//     return {
//         'ID': crystal.id,
//         'Name': crystal.name,
//         'Type': crystal.minor ? 'Minor (m)' : 'Major',
//         'Root (Idx 0)': crystal.base,
//         'Third (Idx 1)': crystal.base + thirdInterval,
//         'Fifth (Idx 2)': crystal.base + 7,
//         'Octave (Idx 3)': crystal.base + 12
//     };
// });

// // 使用 console.table 打印漂亮表格
// console.table(tableData);

/*
┌─────────┬────┬─────────────┬─────────────┬──────────────┬───────────────┬───────────────┬────────────────┐
│ (index) │ ID │ Name        │ Type        │ Root (Idx 0) │ Third (Idx 1) │ Fifth (Idx 2) │ Octave (Idx 3) │
├─────────┼────┼─────────────┼─────────────┼──────────────┼───────────────┼───────────────┼────────────────┤
│ 0       │ 0  │ 'Black'     │ 'Major'     │ 36           │ 40            │ 43            │ 48             │
│ 1       │ 1  │ 'Red'       │ 'Major'     │ 43           │ 47            │ 50            │ 55             │
│ 2       │ 2  │ 'Green'     │ 'Minor (m)' │ 41           │ 44            │ 48            │ 53             │
│ 3       │ 3  │ 'Brown'     │ 'Major'     │ 38           │ 42            │ 45            │ 50             │
│ 4       │ 4  │ 'Blue'      │ 'Major'     │ 40           │ 44            │ 47            │ 52             │
│ 5       │ 5  │ 'Purple'    │ 'Major'     │ 45           │ 49            │ 52            │ 57             │
│ 6       │ 6  │ 'Cyan'      │ 'Minor (m)' │ 45           │ 48            │ 52            │ 57             │
│ 7       │ 7  │ 'LightGray' │ 'Minor (m)' │ 50           │ 53            │ 57            │ 62             │
│ 8       │ 8  │ 'Gray'      │ 'Minor (m)' │ 48           │ 51            │ 55            │ 60             │
│ 9       │ 9  │ 'Pink'      │ 'Major'     │ 53           │ 57            │ 60            │ 65             │
│ 10      │ 10 │ 'Lime'      │ 'Major'     │ 52           │ 56            │ 59            │ 64             │
│ 11      │ 11 │ 'Yellow'    │ 'Major'     │ 55           │ 59            │ 62            │ 67             │
│ 12      │ 12 │ 'LightBlue' │ 'Major'     │ 57           │ 61            │ 64            │ 69             │
│ 13      │ 13 │ 'Magenta'   │ 'Major'     │ 47           │ 51            │ 54            │ 59             │
│ 14      │ 14 │ 'Orange'    │ 'Minor (m)' │ 40           │ 43            │ 47            │ 52             │
│ 15      │ 15 │ 'White'     │ 'Major'     │ 60           │ 64            │ 67            │ 72             │
└─────────┴────┴─────────────┴─────────────┴──────────────┴───────────────┴───────────────┴────────────────┘
*/

/**
 * 水晶和弦静态数据表 (写死音高，避免重复计算)
 * 格式: [Root, Third, Fifth, Octave]
 */
const CRYSTAL_CHORDS = {
    0: [36, 40, 43, 48], // Black (Major)
    1: [43, 47, 50, 55], // Red (Major)
    2: [41, 44, 48, 53], // Green (Minor)
    3: [38, 42, 45, 50], // Brown (Major)
    4: [40, 44, 47, 52], // Blue (Major)
    5: [45, 49, 52, 57], // Purple (Major)
    6: [45, 48, 52, 57], // Cyan (Minor)
    7: [50, 53, 57, 62], // LightGray (Minor)
    8: [48, 51, 55, 60], // Gray (Minor)
    9: [53, 57, 60, 65], // Pink (Major)
    10: [52, 56, 59, 64], // Lime (Major)
    11: [55, 59, 62, 67], // Yellow (Major)
    12: [57, 61, 64, 69], // LightBlue (Major)
    13: [47, 51, 54, 59], // Magenta (Major)
    14: [40, 43, 47, 52], // Orange (Minor)
    15: [60, 64, 67, 72]  // White (Major)
};


/**
 * 输入颜色 ID 数组，输出这些水晶共有的音高
 * @param {number[]} ids - 颜色 ID 数组
 */
function getCommonPitches(ids) {
    if (!ids || ids.length === 0) return [];

    // 1. 直接从静态表获取音符数组
    let sets = ids.map(function (id) {
        return CRYSTAL_CHORDS[id] || [];
    });

    // 2. 找出所有集合的交集
    return sets.reduce(function (common, currentSet) {
        return common.filter(pitch => currentSet.indexOf(pitch) !== -1);
    });
}

const PITCH_TO_CRYSTALS = {
    "36": [{ "id": 0, "name": "Black", "idx": 0 }],
    "38": [{ "id": 3, "name": "Brown", "idx": 0 }],
    "40": [{ "id": 0, "name": "Black", "idx": 1 }, { "id": 4, "name": "Blue", "idx": 0 }, { "id": 14, "name": "Orange", "idx": 0 }],
    "41": [{ "id": 2, "name": "Green", "idx": 0 }],
    "42": [{ "id": 3, "name": "Brown", "idx": 1 }],
    "43": [{ "id": 0, "name": "Black", "idx": 2 }, { "id": 1, "name": "Red", "idx": 0 }, { "id": 14, "name": "Orange", "idx": 1 }],
    "44": [{ "id": 2, "name": "Green", "idx": 1 }, { "id": 4, "name": "Blue", "idx": 1 }],
    "45": [{ "id": 3, "name": "Brown", "idx": 2 }, { "id": 5, "name": "Purple", "idx": 0 }, { "id": 6, "name": "Cyan", "idx": 0 }],
    "47": [{ "id": 1, "name": "Red", "idx": 1 }, { "id": 4, "name": "Blue", "idx": 2 }, { "id": 13, "name": "Magenta", "idx": 0 }, { "id": 14, "name": "Orange", "idx": 2 }],
    "48": [{ "id": 0, "name": "Black", "idx": 3 }, { "id": 2, "name": "Green", "idx": 2 }, { "id": 6, "name": "Cyan", "idx": 1 }, { "id": 8, "name": "Gray", "idx": 0 }],
    "49": [{ "id": 5, "name": "Purple", "idx": 1 }],
    "50": [{ "id": 1, "name": "Red", "idx": 2 }, { "id": 3, "name": "Brown", "idx": 3 }, { "id": 7, "name": "LightGray", "idx": 0 }],
    "51": [{ "id": 8, "name": "Gray", "idx": 1 }, { "id": 13, "name": "Magenta", "idx": 1 }],
    "52": [{ "id": 4, "name": "Blue", "idx": 3 }, { "id": 5, "name": "Purple", "idx": 2 }, { "id": 6, "name": "Cyan", "idx": 2 }, { "id": 10, "name": "Lime", "idx": 0 }, { "id": 14, "name": "Orange", "idx": 3 }],
    "53": [{ "id": 2, "name": "Green", "idx": 3 }, { "id": 7, "name": "LightGray", "idx": 1 }, { "id": 9, "name": "Pink", "idx": 0 }],
    "54": [{ "id": 13, "name": "Magenta", "idx": 2 }],
    "55": [{ "id": 1, "name": "Red", "idx": 3 }, { "id": 8, "name": "Gray", "idx": 2 }, { "id": 11, "name": "Yellow", "idx": 0 }],
    "56": [{ "id": 10, "name": "Lime", "idx": 1 }],
    "57": [{ "id": 5, "name": "Purple", "idx": 3 }, { "id": 6, "name": "Cyan", "idx": 3 }, { "id": 7, "name": "LightGray", "idx": 2 }, { "id": 9, "name": "Pink", "idx": 1 }, { "id": 12, "name": "LightBlue", "idx": 0 }],
    "59": [{ "id": 10, "name": "Lime", "idx": 2 }, { "id": 11, "name": "Yellow", "idx": 1 }, { "id": 13, "name": "Magenta", "idx": 3 }],
    "60": [{ "id": 8, "name": "Gray", "idx": 3 }, { "id": 9, "name": "Pink", "idx": 2 }, { "id": 15, "name": "White", "idx": 0 }],
    "61": [{ "id": 12, "name": "LightBlue", "idx": 1 }],
    "62": [{ "id": 7, "name": "LightGray", "idx": 3 }, { "id": 11, "name": "Yellow", "idx": 2 }],
    "64": [{ "id": 10, "name": "Lime", "idx": 3 }, { "id": 12, "name": "LightBlue", "idx": 2 }, { "id": 15, "name": "White", "idx": 1 }],
    "65": [{ "id": 9, "name": "Pink", "idx": 3 }], "67": [{ "id": 11, "name": "Yellow", "idx": 3 }, { "id": 15, "name": "White", "idx": 2 }],
    "69": [{ "id": 12, "name": "LightBlue", "idx": 3 }],
    "72": [{ "id": 15, "name": "White", "idx": 3 }]
};



/* 方向映射：0:左上, 1:右上, 2:右下, 3:左下 */
const DIR = ["↖", "↗", "↘", "↙"];

let targets = [
    [CRYSTALS.Purple, CRYSTALS.Cyan, CRYSTALS.Brown],
    [CRYSTALS.Black, CRYSTALS.Orange, CRYSTALS.Blue],
    [CRYSTALS.Magenta, CRYSTALS.Orange, CRYSTALS.Blue, CRYSTALS.Red],
    [CRYSTALS.Black, CRYSTALS.Orange, CRYSTALS.Blue],
    [CRYSTALS.Cyan, CRYSTALS.Black, CRYSTALS.Gray, CRYSTALS.Green],
    [CRYSTALS.Black, CRYSTALS.Orange, CRYSTALS.Blue],
    [CRYSTALS.Red, CRYSTALS.Brown, CRYSTALS.LightGray],
    [CRYSTALS.Blue, CRYSTALS.Orange, CRYSTALS.Purple, CRYSTALS.Lime],
    [CRYSTALS.Green, CRYSTALS.Gray, CRYSTALS.Cyan, CRYSTALS.Black],
    [CRYSTALS.Green],
    [CRYSTALS.Red, CRYSTALS.LightGray, CRYSTALS.Brown],
    [CRYSTALS.Green],
    [CRYSTALS.Red, CRYSTALS.Blue, CRYSTALS.Orange, CRYSTALS.Magenta],
    [CRYSTALS.Green],
    [CRYSTALS.Red, CRYSTALS.Orange, CRYSTALS.Black],
    [CRYSTALS.Blue, CRYSTALS.Black, CRYSTALS.Orange],
];

targets.forEach((target, index) => {
    let results = getCommonPitches(target);

    if (results.length === 0) {
        console.log(`${index}: 共有音: 无, 解法: 无`);
        return;
    }

    // 构造“解法”部分的字符串
    let solutionStrings = results.map(pitch => {
        let solutions = PITCH_TO_CRYSTALS[pitch];
        let solText = solutions.map(s => `${s.id} ${s.name} ${DIR[s.idx]}`).join(', ');
        return `${pitch}:[${solText}]`;
    });

    // 最终单行输出
    console.log(`${index}: 共有音: ${results.join(', ')}, 解法: ${solutionStrings.join('; ')}`);
});