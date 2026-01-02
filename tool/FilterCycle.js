/*
四种颜色: White, Cyan, Magenta, Yellow
滤光片叠加
Cyan + Magenta = Blue
Cyan + Yellow = Lime
Yellow + Magenta = Red
任何色 + White = 相同色
任何色 + 相同色 = 相同色
等等

滤光游戏：
现有一个 14 个元素的列表，每个位置可以放一个颜色来表示透镜颜色，另有一个目标颜色序列的列表（数量不确定），
游戏流程如下，列表是收尾相接的，每次从使用第1个透镜和第6个透镜来滤光，生成的颜色和第1个目标序列相比较，
然后切换使用第2个透镜和第6个透镜来滤光，和目标序列的第2个颜色做比较...
第6个透镜和第11个透镜来滤光，和目标序列第6个比较...
第10个透镜和第1个透镜来滤光，和目标序列第10个比较...

现在写出一个js代码，输入一个目标序列，找出一个透镜颜色序列可以满足该目标颜色列表
记得考虑如果6+11不能凑得出目标6，可以尝试将1和6对调这种情况
*/





/**
 * @file 滤光镜游戏求解器 (目标与解法分块垂直打印版)
 */

const BASE_VALUES = {
    White: "White", Cyan: "Cyan", Magenta: "Magenta",
    Yellow: "Yellow", Blue: "Blue", Lime: "Lime", Red: "Red",
};

const ANSI_STYLES = {
    White: "\x1b[47m\x1b[30m", Cyan: "\x1b[46m\x1b[30m", Magenta: "\x1b[45m\x1b[37m",
    Yellow: "\x1b[43m\x1b[30m", Blue: "\x1b[44m\x1b[37m", Lime: "\x1b[102m\x1b[30m",
    Red: "\x1b[41m\x1b[37m", Reset: "\x1b[0m"
};

function colorBox(color) {
    if (!color) return "".padEnd(12);
    const style = ANSI_STYLES[color] || "";
    return `${style} ${color.padEnd(10)} ${ANSI_STYLES.Reset}`;
}

function createColorChain(sequence = []) {
    return new Proxy(() => { }, {
        get(target, prop) {
            if (prop === '_raw') return sequence;
            if (BASE_VALUES[prop]) return createColorChain([...sequence, BASE_VALUES[prop]]);
            return undefined;
        }
    });
}
const COLOR = createColorChain();

function solveLensGame(options, ...inputs) {
    const slotCount = options.slots || 14;
    const offset = options.offset || 5;
    const allResults = [];
    const allTargets = [];

    // 1. 解析输入
    for (let input of inputs) {
        let targetSequence = input && input._raw ? input._raw : (Array.isArray(input) ? input : []);
        if (typeof input === 'string') {
            targetSequence = input.split('.').filter(s => s).map(k => BASE_VALUES[k.trim()]);
        }
        allTargets.push(targetSequence);
    }

    const BASIC_COLORS = [BASE_VALUES.White, BASE_VALUES.Cyan, BASE_VALUES.Magenta, BASE_VALUES.Yellow];
    const mixMap = {
        [`${BASE_VALUES.Cyan}+${BASE_VALUES.Magenta}`]: BASE_VALUES.Blue,
        [`${BASE_VALUES.Magenta}+${BASE_VALUES.Cyan}`]: BASE_VALUES.Blue,
        [`${BASE_VALUES.Cyan}+${BASE_VALUES.Yellow}`]: BASE_VALUES.Lime,
        [`${BASE_VALUES.Yellow}+${BASE_VALUES.Cyan}`]: BASE_VALUES.Lime,
        [`${BASE_VALUES.Yellow}+${BASE_VALUES.Magenta}`]: BASE_VALUES.Red,
        [`${BASE_VALUES.Magenta}+${BASE_VALUES.Yellow}`]: BASE_VALUES.Red
    };

    const mix = (c1, c2) => {
        if (c1 === BASE_VALUES.White) return c2;
        if (c2 === BASE_VALUES.White) return c1;
        if (c1 === c2) return c1;
        return mixMap[`${c1}+${c2}`] || null;
    };

    function findSolution(targetSequence) {
        let lenses = new Array(slotCount).fill(null);
        function backtrack(tIdx) {
            if (tIdx === targetSequence.length) return true;
            const idxA = tIdx % slotCount;
            const idxB = (tIdx + offset) % slotCount;
            const targetColor = targetSequence[tIdx];
            const originalA = lenses[idxA], originalB = lenses[idxB];
            for (let colorA of BASIC_COLORS) {
                if (originalA !== null && colorA !== originalA) continue;
                for (let colorB of BASIC_COLORS) {
                    if (originalB !== null && colorB !== originalB) continue;
                    if (mix(colorA, colorB) === targetColor) {
                        lenses[idxA] = colorA; lenses[idxB] = colorB;
                        if (backtrack(tIdx + 1)) return true;
                        lenses[idxA] = originalA; lenses[idxB] = originalB;
                    }
                }
            }
            return false;
        }
        return backtrack(0) ? lenses.map(c => c || BASE_VALUES.White) : null;
    }

    allTargets.forEach(tg => allResults.push(findSolution(tg)));

    // --- 第一部分：打印目标序列对比 ---
    console.log(`\n⚙️  配置: 插槽数=${slotCount}, 偏移量=${offset}`);
    console.log("\n🎯 目标序列对比:");

    let maxTargetLen = Math.max(...allTargets.map(t => t.length));
    let targetHeader = " ".repeat(10);
    allTargets.forEach((_, i) => targetHeader += `序列 ${i + 1}`.padEnd(14));
    console.log(targetHeader);

    for (let i = 0; i < maxTargetLen; i++) {
        let row = `步骤 ${String(i + 1).padStart(2, '0')}:  `;
        allTargets.forEach(tg => {
            row += colorBox(tg[i]) + "  ";
        });
        console.log(row);
    }

    // --- 第二部分：打印最终解法对比 ---
    if (allResults.every(r => r !== null)) {
        console.log("\n✅ 成功找到解 (透镜配置):");

        let lensHeader = " ".repeat(10);
        allResults.forEach((_, i) => lensHeader += `方案 ${i + 1}`.padEnd(14));
        console.log(lensHeader);

        for (let i = 0; i < slotCount; i++) {
            let row = `位置 ${String(i + 1).padStart(2, '0')}:  `;
            allResults.forEach(res => {
                row += colorBox(res[i]) + "  ";
            });
            console.log(row);
        }
    } else {
        console.log("\n❌ 其中部分序列在当前配置下无解。");
    }
}


// --- 使用演示 ---

// solveLensGame({ slots: 14, offset: 5 },
//     COLOR.Blue.Cyan.Cyan.Blue.Yellow.Magenta.Cyan.Magenta,
//     COLOR.White.Lime.Yellow.Cyan.Magenta.Cyan.Cyan.Yellow
// );


// solveLensGame({ slots: 16, offset: 4 },
//     COLOR.Blue.Red.Lime.Cyan.Cyan.Magenta.Yellow.Cyan.Cyan,
//     COLOR.Yellow.Lime.Cyan.Lime.Yellow.Cyan.Yellow.Yellow.Yellow,
//     COLOR.Magenta.Yellow.Red.Cyan.White.Magenta.Magenta.White.Magenta
// )

// solveLensGame({ slots: 18, offset: 7 },
//     COLOR.Red.Magenta.Yellow.Cyan.Blue.Magenta.Cyan.Magenta.Cyan.Yellow.Cyan.Lime,
//     COLOR.White.Red.Yellow.Red.Red.Lime.Cyan.Magenta.Yellow.Cyan.Yellow.Magenta,
//     COLOR.Red.Yellow.Yellow.Cyan.Cyan.Magenta.Lime.Magenta.Yellow.Yellow.Cyan.Lime
// )

solveLensGame({ slots: 18, offset: 7 },
    COLOR.Magenta.Yellow.Blue.Blue.Lime.Red.Lime.Magenta.Yellow.Magenta.Magenta.Blue,
    COLOR.Magenta.Cyan.Blue.White.Lime.Lime.Yellow.Magenta.White.Magenta.White.Cyan,
    COLOR.Red.Yellow.Blue.Red.Cyan.Cyan.Magenta.Yellow.Yellow.Cyan.Yellow.Blue,
    COLOR.Lime.Red.White.Cyan.Lime.Cyan.Blue.Yellow.Magenta.Magenta.Cyan.Cyan
)