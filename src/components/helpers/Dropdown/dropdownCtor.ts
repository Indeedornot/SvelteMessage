import { createPopperActions } from 'svelte-popperjs';

export type Placement =
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

export type Offset = { x: number; y: number };

export type DropdownProps = {
	placement: Placement;
	offset: Offset;
	fallbackPlacements: Placement[];
	strategy: 'absolute' | 'fixed';
};

export type ExtraOpts = {
	modifiers: [
		{
			name: 'offset';
			options: {
				offset: [number, number];
			};
		},
		{
			name: 'flip';
			options: {
				fallbackPlacements: Placement[];
			};
		}
	];
};

export const createDropdown = (data: DropdownProps) => {
	const { placement, offset, fallbackPlacements, strategy } = data;
	const [popperRef, popperContent] = createPopperActions({
		placement: placement,
		strategy: strategy
	});

	const extraOpts: ExtraOpts = {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [offset.y, offset.x]
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
