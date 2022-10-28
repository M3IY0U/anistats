<script lang="ts">
	import type { AnimeEntry } from './util/AnimeEntry';

	export let info: AnimeEntry;
</script>

<div class="anime-container" style="background-image: url({info.image});">
	<a href={info.url} target="_blank" rel="noopener noreferrer">{info.title}</a>
	<div class="status">{info.status}</div>
</div>

<style>
	.anime-container {
		display: flex;
		width: 10rem;
		height: 15rem;
		flex-direction: column;
		justify-content: space-between;
		background-size: cover;
		margin: 3px;
		border-radius: 5px;
		text-shadow: -1.5px 0 #000, 0 1.5px #000, 1.5px 0 #000, 0 -1.5px #000;
	}
	a,.status {
		text-decoration: none;
		color: white;
	}
    .status { 
        align-self: flex-end;
    }
</style>
