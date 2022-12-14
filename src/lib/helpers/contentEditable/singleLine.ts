import { restoreCursorPos, saveCursorPos } from '$lib/helpers/contentEditable';

export function singleLine(node: HTMLElement) {
	const regex = /(?:\r\n|\r|\n)/g;
	node.innerText = node.innerText.replace(regex, '');

	//prevent new lines
	const handleInput = (e: Event) => {
		const input = e.target as HTMLDivElement;
		if (input.innerText.match(regex)) {
			const caretPosition = saveCursorPos(node);
			input.innerText = input.innerText.replace(regex, '');
			restoreCursorPos(input, caretPosition);
			node.focus();
		}
	};

	node.addEventListener('input', handleInput);
	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
}
