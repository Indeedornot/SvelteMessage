import autosize from 'autosize';

export function autoResize(node: HTMLTextAreaElement, value?: string) {
	if (!node) return;

	autosize(node);

	return {
		destroy() {
			autosize.destroy(node);
		},

		update(newValue: string) {
			if (newValue && newValue !== value) {
				value = newValue;
			}
			autosize.update(node);
		}
	};
}
