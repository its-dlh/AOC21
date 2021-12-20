const raw = `OHFNNCKCVOBHSSHONBNF

SV -> O
KP -> H
FP -> B
VP -> V
KN -> S
KS -> O
SB -> K
BS -> K
OF -> O
ON -> S
VS -> F
CK -> C
FB -> K
CH -> K
HS -> H
PO -> F
NP -> N
FH -> C
FO -> O
FF -> C
CO -> K
NB -> V
PP -> S
BB -> N
HH -> B
KK -> H
OP -> K
OS -> V
KV -> F
VH -> F
OB -> S
CN -> H
SF -> K
SN -> P
NF -> H
HB -> V
VC -> S
PS -> P
NK -> B
CV -> P
BC -> S
NH -> K
FN -> P
SH -> F
FK -> P
CS -> O
VV -> H
OC -> F
CC -> N
HK -> N
FS -> P
VF -> B
SS -> V
PV -> V
BF -> V
OV -> C
HO -> F
NC -> F
BN -> F
HC -> N
KO -> P
KH -> F
BV -> S
SK -> F
SC -> F
VN -> V
VB -> V
BH -> O
CP -> K
PK -> K
PB -> K
FV -> S
HN -> K
PH -> B
VK -> B
PC -> H
BO -> H
SP -> V
NS -> B
OH -> N
KC -> H
HV -> F
HF -> B
HP -> S
CB -> P
PN -> S
BK -> K
PF -> N
SO -> P
CF -> B
VO -> C
OO -> K
FC -> F
NV -> F
OK -> K
NN -> O
NO -> O
BP -> O
KB -> O
KF -> O`;

console.time('all');

const [polymerTemplate, _, ...rulesRaw] = raw.split('\n');

const elementSet = new Set();

for (const el of polymerTemplate) {
    elementSet.add(el);
}

const elements = [...elementSet];
const elementIds = {};
for (let i = 0; i < elements.length; i++) {
    elementIds[ elements[i] ] = i;
}


const toEl = el => {
    if (typeof elementIds[el] == 'undefined') {
        elementIds[el] = elementSet.size;
        elementSet.add(el);
    }
    return elementIds[el];
}

let master = new Uint8Array(256);
const masterLength = master.length;

console.log('master size', master.byteLength / 1000000000);

// let polymer = Uint8Array.from([...polymerTemplate].map(toEl));
const initPolymer = [...polymerTemplate].map(toEl);
// let polymer = master.subarray(0, initPolymer.length);
// polymer.set(initPolymer);

const rules = rulesRaw.reduce((acc, rule) => {
    const [key, ins] = rule.split(' -> ');
    if (!acc[toEl(key[0])]) acc[toEl(key[0])] = {};
    acc[toEl(key[0])][toEl(key[1])] = toEl(ins);
    return acc;
}, {});

// console.log(rules);
// console.log(elementIds);

const cat = strings => strings.join('');

console.time('polymer');

let elCountMap = {};

function countEl(el) {
    let elCount = elCountMap[el] ?? 0;
    elCount++;
    elCountMap[el] = elCount;
};

countEl(initPolymer[0]);

const STEPS = 20;

function processPair(pair, step) {
    if (step == STEPS) {
        // countEl(pair[0]);
        countEl(pair[1]);
        return;
    }
    
    const insertion = rules[ pair[0] ]?.[ pair[1] ];
    
    const start = step * 3;
    master[start] = pair[0];
    if (typeof insertion == 'number') {
        master[start+1] = insertion;
        master[start+2] = pair[1];
        processPair(master.subarray(start, start+2), step + 1);
        processPair(master.subarray(start+1, start+3), step + 1);
    } else {
        master[start+1] = pair[1];
        processPair(master.subarray(start, start+2), step + 1);
    }
}

for (let i = 0; i < initPolymer.length - 1; i++) {
    processPair([initPolymer[i], initPolymer[i+1]], 0);
}

console.timeEnd('polymer');
// console.time('reduce');

// const elements = [...polymer].reduce((acc, el) => {
//     let elCount = acc[el] ?? 0;
//     elCount++;
//     acc[el] = elCount;
//     return acc;
// }, {});

// console.timeEnd('reduce');

console.time('count');
// const sortedElements = Object.entries(elements).sort(([,a], [,b]) => b - a);
const elementCounts = Object.values(elCountMap).sort((a, b) => b - a);
const difference = elementCounts[0] - elementCounts.at(-1);
console.timeEnd('count');
console.log(elCountMap);

console.log(STEPS, 'steps');
console.log(difference);

console.timeEnd('all');
// console.log(polymer);
// console.log(cat([...polymer].map(id => elements[id])));