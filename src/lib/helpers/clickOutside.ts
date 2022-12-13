/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, exceptions: HTMLElement[] = []) {
	let except = exceptions;

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
			!except.find((x) => x?.contains(target) || x === target)
		) {
			node.dispatchEvent(new CustomEvent('clickOutside', { detail: node }));
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
		},
		update(newExceptions: HTMLElement[]) {
			except = newExceptions;
		}
	};
}
