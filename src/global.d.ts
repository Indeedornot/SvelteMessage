//Quick typing fix for svelte-dnd-action
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onclickOutside?: () => void;
	}
}
