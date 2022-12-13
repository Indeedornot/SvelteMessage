<script lang="ts">
	export let width: number;
	export let height: number;

	export let username: string;
	export let rounded = true;
</script>

<img src="https://icotar.com/avatar/{username}" width={width} height={height} class:rounded-full={rounded} />
