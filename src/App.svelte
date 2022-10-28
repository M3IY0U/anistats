<script lang="ts">
  import { Queries } from "./lib/util/Queries";
  import GenreBarChart from "./lib/GenreBarChart.svelte";
  import EpisodeScatterChart from "./lib/EpisodeScatterChart.svelte";
  import type { AnimeEntry } from "./lib/util/AnimeEntry";
  import { Jellyfish } from "svelte-loading-spinners";
  import RatingBarChart from "./lib/RatingBarChart.svelte";

  let username = "Meiyou";
  let entries: Array<AnimeEntry> = [];
  let gbc: GenreBarChart;
  let epc: EpisodeScatterChart;
  let rrc: RatingBarChart;

  async function doRequest(username: string) {
    entries = [];
    document
      .getElementById("loading-spinner")
      .setAttribute("style", "opacity: 100%");

    entries = await Queries.fetchData(username);

    document
      .getElementById("loading-spinner")
      .setAttribute("style", "opacity: 0%");
    if (gbc != undefined) gbc.updateChart();
    if (epc != undefined) epc.updateChart();
  }
</script>

<h1>Anilist Stats Thingy</h1>
<div class="username-form">
  <form
    class="name-submit"
    on:submit|preventDefault={() => doRequest(username)}
  >
    <input
      type="text"
      name="username"
      placeholder="Username"
      bind:value={username}
      id="username-input"
      required
    />
  </form>
</div>
<div id="loading-spinner" style="opacity: 0%;">
  <Jellyfish size="200" color="#02a9ff" unit="px" duration="2s" />
</div>
{#if entries.length > 0}
  <div class="grid-container">
    <div class="grid-item">
      <GenreBarChart bind:this={gbc} {entries} />
    </div>
    <div class="grid-item">
      <EpisodeScatterChart bind:this={epc} {entries} />
    </div>
    
    <div class="grid-item">
      <RatingBarChart bind:this={rrc} {entries} />
    </div>
  </div>
{/if}

<style>
  h1 {
    font-size: 3rem;
    text-align: center;
    line-height: 1;
  }

  .username-form {
    text-align: center;
    width: 35%;
    display: flex;
    align-items: center;
    font-size: 2rem;
    justify-content: center;
    margin-bottom: 2rem;
  }

  #username-input {
    min-width: 200px;
  }

  #username-input:focus {
    outline: none;
  }

  input[type="text"] {
    width: 100%;
    padding: 1fr;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #02a9ff;
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    font-size: 2rem;
    font-family: "Baloo 2";
  }

  .grid-container {
    width: 100%;
    margin: 15px;
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
