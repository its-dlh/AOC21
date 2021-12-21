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

const getScores = () => players.map(player => player.score);
const getMinScore = () => Math.min(...getScores());
const getMaxScore = () => Math.max(...getScores());

function* createDice() {
	while (true) {
		for (let i = 1; i <= 100; i++) {
			yield i;
		}
	}
}

const dice = createDice();

let rollCount = 0;
function roll() {
	rollCount++;
	return dice.next().value;
}

const wrap = pos => pos > 10 ? wrap(pos - 10) : pos;

function takeTurn(player) {
	const newPos = player.position + roll() + roll() + roll();
	player.position = wrap(newPos);
	player.score += player.position;
}


outer: while (true) {
	for (const player of players) {
		takeTurn(player);
		if (player.score >= 1000) {
			break outer;
		}
	}
}

const losingScore = getMinScore();
console.log({losingScore, rollCount});
console.log(losingScore * rollCount);
