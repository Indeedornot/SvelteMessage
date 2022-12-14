/* eslint-disable @typescript-eslint/no-non-null-assertion */

//https://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376:~:text=Here%20is%20an%20updated%20version%20that%20I%20use%20in%20a%20major%20project

export const saveCursorPos = (containerEl: HTMLElement) => {
	// Get range
	const selection = window.getSelection();
	if (selection && selection.rangeCount > 0) {
		const range = selection.getRangeAt(0);
		return {
			start: getNodeOffset(containerEl, range.startContainer)! + totalOffsets(range.startContainer, range.startOffset),
			end: getNodeOffset(containerEl, range.endContainer)! + totalOffsets(range.endContainer, range.endOffset)
		};
	}

	return {
		start: 0,
		end: 0
	};
};

export const restoreCursorPos = (containerEl: HTMLElement, savedSel: { start: number; end: number }) => {
	if (!savedSel) return;

	const range = document.createRange();

	const startNodeOffset = getNodeAndOffsetAt(containerEl, savedSel.start);
	const endNodeOffset = getNodeAndOffsetAt(containerEl, savedSel.end);

	range.setStart(startNodeOffset!.node, startNodeOffset!.offset);
	range.setEnd(endNodeOffset!.node, endNodeOffset!.offset);

	const sel = window.getSelection();
	sel?.removeAllRanges();
	sel?.addRange(range);
};

/*
 Gets the offset of a node within another node. Text nodes are
 counted a n where n is the length. Entering (or passing) an
 element is one offset. Exiting is 0.
 */
const getNodeOffset = (start: Node, dest: Node) => {
	let offset = 0;

	let node = start;
	const stack: Node[] = [];

	while (true!) {
		if (node === dest) {
			return offset;
		}

		// Go into children
		if (node.firstChild) {
			// Going into first one doesn't count
			if (node !== start) offset += 1;
			stack.push(node);
			node = node.firstChild;
			continue;
		}

		// If can go to next sibling

		// If text, count length
		if (node.nodeType === 3) offset += node.nodeValue!.length + 1;
		else offset += 1;

		if (stack.length > 0 && node.nextSibling) {
			node = node.nextSibling;
			continue;
		}

		// No children or siblings, move up stack
		while (true!) {
			if (stack.length <= 1) return offset;

			const next = stack.pop();

			// Go to sibling
			if (next && next.nextSibling) {
				node = next.nextSibling;
				break;
			}
		}
	}
};

// Calculate the total offsets of a node
const calculateNodeOffset = (node: Node) => {
	let offset = 0;

	// If text, count length
	if (node.nodeType === 3) offset += node.nodeValue!.length + 1;
	else offset += 1;

	if (node.childNodes) {
		for (const element of node.childNodes) {
			offset += calculateNodeOffset(element);
		}
	}

	return offset;
};

// Determine total offset length from returned offset from ranges
const totalOffsets = (parentNode: Node, offset: number) => {
	if (parentNode.nodeType == 3) return offset;

	if (parentNode.nodeType == 1) {
		let total = 0;
		// Get child nodes
		for (const childNode of parentNode.childNodes) {
			total += calculateNodeOffset(childNode);
		}
		return total;
	}

	return 0;
};

const getNodeAndOffsetAt = (start: Node, offset: number) => {
	let node = start;
	const stack = [];

	while (true!) {
		// If arrived
		if (offset <= 0) return { node: node, offset: 0 };

		// If will be within current text node
		if (node.nodeType == 3 && offset <= node.nodeValue!.length) {
			return { node: node, offset: Math.min(offset, node.nodeValue!.length) };
		}

		// Go into children (first one doesn't count)
		if (node.firstChild) {
			if (node !== start) offset -= 1;
			stack.push(node);
			node = node.firstChild as Node;
			continue;
		}

		// If can go to next sibling
		if (stack.length > 0 && node.nextSibling) {
			// If text, count length
			if (node.nodeType === 3) offset -= node.nodeValue!.length + 1;
			else offset -= 1;

			node = node.nextSibling;
			continue;
		}

		// No children or siblings, move up stack
		while (true!) {
			if (stack.length <= 1) {
				// No more options, use current node
				if (node.nodeType == 3) return { node: node, offset: Math.min(offset, node.nodeValue!.length) };
				else return { node: node, offset: 0 };
			}

			const next = stack.pop();

			// Go to sibling
			if (next!.nextSibling) {
				// If text, count length
				if (node.nodeType === 3) offset -= node.nodeValue!.length + 1;
				else offset -= 1;

				node = next!.nextSibling;
				break;
			}
		}
	}
};
