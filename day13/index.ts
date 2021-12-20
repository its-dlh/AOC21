const raw: string = await Deno.readTextFile("./input");

const [dotsRaw, foldsRaw] = raw.split('\n\n');

let dots = dotsRaw.split('\n').map(dotRaw => dotRaw.split(',').map(dotCoord => parseInt(dotCoord)));

const initialDimensions = dots.reduce(([maxX, maxY], [dotX, dotY]) => ([
	Math.max(maxX, dotX),
	Math.max(maxY, dotY)
]));

const folds = foldsRaw.split('\n').filter(a => !!a).map(foldRaw => {
	// console.log('foldRaw:', foldRaw);
	const [_, axis, posRaw] = foldRaw.match(/(x|y)=(\d+)/)!;
	return [axis === 'y' ? 1 : 0, parseInt(posRaw)]
});

// console.log('folds:', folds);

for (const [foldAxis, foldPos] of folds) {
	for (const dot of dots) {
		if (dot[foldAxis] > foldPos) {
			dot[foldAxis] = foldPos * 2 - dot[foldAxis]
		}
	}
}

// const dotStrings = dots.map(dot => dot.join(','));
// console.log(dotStrings.length);
// const dotSet = new Set(dotStrings);

// console.log(dotSet.size);

const [maxX, maxY] = dots.reduce(([maxX, maxY], [dotX, dotY]) => ([
	Math.max(maxX, dotX),
	Math.max(maxY, dotY)
]));

console.log({maxX, maxY});

let grid: string[][] = [];
for (let y = 0; y <= maxY; y++) {
	let row: string[] = [];
	
	for (let x = 0; x <= maxX; x++) {
		row.push(' ');
	}
	
	grid.push(row);
}

for (const [x, y] of dots) {
	console.log({x, y});
	grid[y][x] = '#';
}

const output = grid.map(row => row.join('')).join('\n');
console.log(output);
