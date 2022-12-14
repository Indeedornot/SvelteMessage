import { createPopperActions } from 'svelte-popperjs';

type Placement =
	| 'auto'
	| 'auto-start'
	| 'auto-end'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'left'
	| 'left-start'
	| 'left-end';

export type DropdownProps = {
	placement: Placement;
	offset: [x: number, y: number];
	fallbackPlacements: Placement[];
	strategy: 'absolute' | 'fixed';
};

export const createDropdown = (data: DropdownProps) => {
	const { placement, offset, fallbackPlacements, strategy } = data;
	const [popperRef, popperContent] = createPopperActions({
		placement: placement,
		strategy: strategy
	});

	const extraOpts = {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: offset
				}
			},
			{
				name: 'flip',
				options: {
					fallbackPlacements: fallbackPlacements
				}
			}
		]
	};

	return { popperRef, popperContent, extraOpts };
};
