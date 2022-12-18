export function dropdownHover(node: HTMLElement) {
	const parent = node.parentElement;
	if (!parent) return;

	let timeout: NodeJS.Timeout;

	const handleEnter = () => {
		//if a user is hovering over an element or a sibling of an element, don't hide the tooltip
		clearTimeout(timeout);
		node.dispatchEvent(
			new CustomEvent('dropdownHover', {
				detail: true
			})
		);
	};

	const handleLeave = () => {
		timeout = setTimeout(() => {
			node.dispatchEvent(
				new CustomEvent('dropdownHover', {
					detail: false
				})
			);
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
