import autosize from 'autosize';

export function autoResize(node: HTMLTextAreaElement) {
	if (!node) return;

	autosize(node);

	return {
		destroy() {
			autosize.destroy(node);
		}
	};
}
