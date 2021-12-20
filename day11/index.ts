const rawInput: string = await Deno.readTextFile("./input");

let octos = rawInput
	.split('\n')
	.map(line => [...line].map(val => parseInt(val)))

// console.log(octos);
const octoCount = octos.length * octos[0].length;
let flashCount = 0;
let stepFlashCount = 0;

function flash(cX: number, cY: number) {
	flashCount++;
	stepFlashCount++;
	const minX = Math.max(cX - 1, 0);
	const maxX = Math.min(cX + 1, octos[cY].length - 1);
	const minY = Math.max(cY - 1, 0);
	const maxY = Math.min(cY + 1, octos.length - 1);
	
	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			if (typeof octos[y][x] !== 'number') console.warn('problem with', {x, y});
			
			if (octos[y][x] == 0) continue;
			if (octos[y][x] >= 9) {
				octos[y][x] = 0;
				flash(x, y);
			} else {
				octos[y][x]++
			}
		}
	}
}

// const stepCount = 100;
let step = 0;

while (stepFlashCount < octoCount) {
	step++;
	stepFlashCount = 0;
	octos = octos.map(row => row.map(octo => octo + 1));
	// console.log(octos);

	for (let y = 0; y < octos.length; y++) {
		for (let x = 0; x < octos[y].length; x++) {
			if (octos[y][x] > 9) {
				octos[y][x] = 0;
				flash(x, y);
			}
		}
	}
}

console.log(step);