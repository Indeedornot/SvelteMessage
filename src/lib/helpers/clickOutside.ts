type ClickOutsideProps = {
	exceptions?: HTMLElement[];
	callback: (node: HTMLElement) => void;
};

/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, { exceptions = [], callback }: ClickOutsideProps) {
	const handleClick = (event: Event) => {
		const target = event.target as HTMLElement;

		if (
			node &&
			node !== target &&
			//still in dom
			document.body.contains(target) &&
			!event.defaultPrevented &&
			//not a child of node
			!node.contains(target) &&
			//not in exceptions
			!exceptions.find((x) => x?.contains(target) || x === target)
		) {
			callback(node);
		}
	};

	document.addEventListener('click', handleClick, { capture: true });
	document.addEventListener('touchstart', handleClick, { capture: true });
	document.addEventListener('mousedown', handleClick, { capture: true });

	return {
		destroy() {
			document.removeEventListener('click', handleClick, { capture: true });
			document.removeEventListener('touchstart', handleClick, { capture: true });
			document.removeEventListener('mousedown', handleClick, { capture: true });
		}
	};
}
