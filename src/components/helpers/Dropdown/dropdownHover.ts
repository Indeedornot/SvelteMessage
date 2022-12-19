export function dropdownHover(node: HTMLElement, callback: (hovering: boolean) => void) {
	const parent = node.parentElement;
	if (!parent) return;

	let timeout: NodeJS.Timeout;

	const handleEnter = () => {
		//if a user is hovering over an element or a sibling of an element, don't hide the tooltip
		clearTimeout(timeout);
		callback(true);
	};

	const handleLeave = () => {
		timeout = setTimeout(() => {
			callback(false);
		}, 100);
	};

	parent.addEventListener('mouseenter', handleEnter);
	parent.addEventListener('mouseleave', handleLeave);

	return {
		destroy() {
			node.removeEventListener('mouseenter', handleEnter);
			node.removeEventListener('mouseleave', handleLeave);
		}
	};
}
