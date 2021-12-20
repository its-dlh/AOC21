export interface Node {
	id: string;
	connectedTo: Node[];
	isSmall?: boolean;
	isStart?: boolean;
	isEnd?: boolean
}

const nodes: Record<string, Node> = {
	start: {
		id: 'start',
		isStart: true,
		connectedTo: []
	},
	end: {
		id: 'end',
		isEnd: true,
		connectedTo: []
	}
};

export function getNode(id: string) {
	if (!nodes[id]) {
		nodes[id] = {
			id,
			isSmall: id.charCodeAt(0) >= 97,
			connectedTo: []
		}
	}
	
	return nodes[id];
}

export function connectNodes(idA: string, idB: string) {
	console.log('connecting', idA, 'and', idB);
	const a = getNode(idA);
	const b = getNode(idB);
	
	if (!a.connectedTo.includes(b)) a.connectedTo.push(b);
	if (!b.connectedTo.includes(a)) b.connectedTo.push(a);
}
