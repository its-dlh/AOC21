const players = [
	{
		position: 7,
		score: 0
	},
	{
		position: 4,
		score: 0
	}
];

const WIN_AT = 21;

// const getScores = () => players.map(player => player.score);
// const getMinScore = () => Math.min(...getScores());
// const getMaxScore = () => Math.max(...getScores());

function* createDie() {
	for (let i = 1; i <= 3; i++) {
		for (let j = 1; j <= 3; j++) {
			for (let k = 1; k <= 3; k++) {
				yield [i, j, k];
			}
		}
	}
}

const die = [...createDie()];

const wrap = pos => pos > 10 ? wrap(pos - 10) : pos;

// function takeTurn(player) {
// 	const newPos = player.position + roll() + roll() + roll();
// 	player.position = wrap(newPos);
// 	player.score += player.position;
// }

const posCountCache = {};
for (const pos of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
	// const die = createDie();
	const newPosCounts = {}; //{1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0};
	
	for (const roll of die) {
		const newPos = wrap(
			pos + roll[0] + roll[1] + roll[2]
		);
		
		if (!newPosCounts[newPos]) newPosCounts[newPos] = 0;
		newPosCounts[newPos]++;
	}
	
	posCountCache[pos] = newPosCounts;
}

console.log(posCountCache);

function takeTurn(pos, score, i, multiplier, turnCountCache) {
	if (score >= WIN_AT) {
		if (!turnCountCache[i]) turnCountCache[i] = 0;
		turnCountCache[i] += multiplier;
		return;
	}
	
	const posCounts = Object.entries(posCountCache[pos]);
	for (const [newPos, count] of posCounts) {
		takeTurn(
			newPos,
			score + parseInt(newPos),
			i + 1,
			multiplier * count,
			turnCountCache
		)
	}
}

const turnCountCache1 = {};
takeTurn(4, 0, 0, 1, turnCountCache1);

console.log(turnCountCache1);

const turnCountCache2 = {};
takeTurn(8, 0, 0, 1, turnCountCache2);

console.log(turnCountCache2);

const countem = cache => Object.values(cache).reduce((acc, curr) => acc + curr);

console.log(countem(turnCountCache1) + countem(turnCountCache2));
console.log(444356092776315 + 341960390180808);


const wins = [0, 0];

for (const [turns1, count1] of Object.entries(turnCountCache1)) {
	for (const [turns2, count2] of Object.entries(turnCountCache2)) {
		if (parseInt(turns1) <= parseInt(turns2)) {
			wins[0] += count1 * count2;
		} else {
			wins[1] += count1 * count2;
		}
	}
}

console.log(wins);