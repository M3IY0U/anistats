<script lang="ts">
  import { Queries } from "./lib/queries";
  import GenreBarChart from "./lib/GenreBarChart.svelte";
  import EpisodeScatterChart from "./lib/EpisodeScatterChart.svelte";
  import type { AnimeEntry } from "./lib/AnimeEntry";
  import { Jellyfish } from "svelte-loading-spinners"

  let username = "Meiyou";
  let entries: Array<AnimeEntry> = [];
  let gbc: GenreBarChart;
  let epc: EpisodeScatterChart;

  async function doRequest(username: string) {
    entries = [];
    document.getElementById("loading-spinner").setAttribute("style", "opacity: 100%"); 

    entries = await Queries.fetchData(username);

    document.getElementById("loading-spinner").setAttribute("style", "opacity: 0%"); 
    if (gbc != undefined) gbc.updateChart();
    if (epc != undefined) epc.updateChart();
  }
</script>

<h1>Anilist Stats Thingy</h1>
<form class="name-submit" on:submit|preventDefault={() => doRequest(username)}>
  <label for="username-input">Username</label>
  <input
    type="text"
    name="username"
    bind:value={username}
    id="username-input"
  />
  <input type="button" value="Start" on:click={() => doRequest(username)} /><br
  />
</form>

<div id="loading-spinner" style="opacity: 0%;">
  <Jellyfish size="200" color="#02a9ff" unit="px" duration="2s"/>
</div>
{#if entries.length > 0}
  <div class="grid-container">
    <div class="grid-item">
      <GenreBarChart bind:this={gbc} {entries} />
    </div>
    <div class="grid-item">
      <EpisodeScatterChart bind:this={epc} {entries} />
    </div>
  </div>
{/if}

<style>
  h1 {
    font-size: 3rem;
  }
  .grid-container {
    display: grid;
    grid-template-columns: auto auto;
    background-color: #454545;
    gap: 15px;
  }

  .grid-item {
    background-color: #393939;
  }

  #loading-spinner {
    position: absolute;
    top: 30%;
  }
</style>
