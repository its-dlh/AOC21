import { connectNodes, getNode, Node } from './nodes.ts';

const rawInput: string = await Deno.readTextFile("./input");

rawInput
	.split('\n')
	.map(line => line.split('-'))
	.forEach(ids => connectNodes(...ids as [string, string]));

let paths: Node[][] = [];

function visit(node: Node, priorPath: Node[], hasDoneDoubleSmall: boolean = false): void {
	if (priorPath.includes(node)) {
		if (node.isStart) return;
		
		if (node.isSmall && hasDoneDoubleSmall) return;
		if (node.isSmall) hasDoneDoubleSmall = true;
	}
	// console.log('visit', node);
	
	const path = [...priorPath, node];
	
	if (node.isEnd) {
		paths.push(path);
		return;
	}
	
	return node.connectedTo.forEach(n => visit(n, path, hasDoneDoubleSmall));
}

const start = getNode('start');
visit(start, []);

console.log('------');
console.log(paths.length);