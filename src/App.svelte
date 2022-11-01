<script lang="ts">
  import { Queries } from "./lib/util/Queries";
  import GenreBarChart from "./lib/GenreBarChart.svelte";
  import EpisodeDonutChart from "./lib/EpisodeDonutChart.svelte";
  import type { AnimeEntry } from "./lib/util/AnimeEntry";
  import { Jellyfish } from "svelte-loading-spinners";
  import RatingLineChart from "./lib/RatingLineChart.svelte";
  import TagBarChart from "./lib/TagBarChart.svelte";
  import Toggle from "svelte-toggle";
  import { animeToggle, entries } from "./lib/util/stores";
  import DateBarChart from "./lib/DateBarChart.svelte";

  let username = "";
  let toggled = true;
  let lists: Array<string>;
  let allEntries: Array<AnimeEntry>;
  let errorMessage = "";

  $: {
    animeToggle.set(toggled);
  }

  function filterEntries() {
    let selected = [...document.querySelectorAll("input:checked")].map(
      (x) => x.id
    );
    if (selected.length > 0) {
      $entries = allEntries.filter((x) => selected.includes(x.status));
    } else {
      $entries = allEntries;
      document
        .querySelectorAll("input[type=checkbox]")
        .forEach((x: HTMLInputElement) => (x.checked = true));
    }
  }

  async function doRequest(username: string) {
    if (!username) return;
    errorMessage = "";
    allEntries = [];
    $entries = [];
    document
      .getElementById("loading-spinner")
      .setAttribute("style", "opacity: 100%");

    allEntries = await Queries.fetchData(username, toggled);
    lists = [...new Set(allEntries.map((e) => e.status))];

    $entries = allEntries;

    document
      .getElementById("loading-spinner")
      .setAttribute("style", "opacity: 0%");

    errorMessage =
      allEntries.length < 1
        ? `No ${$animeToggle ? "Anime" : "Manga"} entries found for this user!`
        : "";
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
  <Toggle
    bind:toggled
    on:toggle={() => doRequest(username)}
    label=""
    on="Anime"
    off="Manga"
  />
</div>
<div id="loading-spinner" style="opacity: 0%;">
  <Jellyfish size="200" color="#02a9ff" unit="px" duration="2s" />
</div>
{#if $entries.length > 0}
  <div id="lists">
    {#each lists as list}
      <label for="list-{list}">
        <input
          type="checkbox"
          name={list}
          id={list}
          checked
          on:change={filterEntries}
        />
        {list}
      </label>
    {/each}
  </div>
  <span>
    Total {$animeToggle ? "Anime" : "Manga"} entries: {allEntries.length} | Filtered
    entries: {$entries.length}
  </span>
  <div class="grid-container">
    <div class="grid-item">
      <GenreBarChart />
    </div>

    <div class="grid-item">
      <TagBarChart />
    </div>

    <div class="grid-item">
      <EpisodeDonutChart />
    </div>

    <div class="grid-item">
      <DateBarChart />
    </div>

    <div class="grid-item">
      <RatingLineChart />
    </div>
  </div>
{:else}
  {errorMessage}
{/if}

<style>
  h1 {
    font-size: 3rem;
    text-align: center;
    line-height: 1;
  }

  .name-submit {
    margin-right: 20px;
  }

  .username-form {
    text-align: center;
    width: 35%;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  #username-input {
    min-width: 200px;
    margin-bottom: 1rem;
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
    margin: 15px;
    display: grid;
    padding: 20px;
    border-radius: 10px;
    grid-template-columns: auto auto;
    background-color: #454545;
    gap: 15px;
  }

  .grid-item {
    background-color: #393939;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #loading-spinner {
    position: absolute;
    top: 30%;
  }
</style>
