<script lang="ts">
  import { request } from "graphql-request";
  import { AnimeEntry } from "./lib/AnimeEntry";
  import { Queries } from "./lib/queries";
  import GenreBarChart from "./lib/GenreBarChart.svelte";
  import EpisodePieChart from "./lib/EpisodePieChart.svelte";
  let username = "Meiyou";
  let entries: Array<AnimeEntry> = [];
  let gbc: GenreBarChart;
  let epc: EpisodePieChart;


  async function doRequest(username: string) {
    entries = [];
    let result = await request(
      Queries.apiUrl,
      Queries.retrieveList.replace("$id", username)
    );
    for (const list of result.MediaListCollection.lists) {
      if(list.name != "Completed" && list.name != "Watching") continue;
      list.entries.forEach((entry: any) => {
        entry = entry.media;
        entries.push(
          new AnimeEntry(
            list.name,
            entry.title.romaji,
            entry.coverImage.extraLarge,
            entry.siteUrl,
            entry.genres,
            entry.episodes
          )
        );
      });
    }
    console.log(entries);
    entries = entries;
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
<div id="entries-container" class="entries-container">

  {#if entries.length > 0}
    <GenreBarChart bind:this={gbc} entries={entries} />
    <EpisodePieChart  bind:this={epc} entries={entries} />
  {/if}
</div>

<style>
  h1 {
    font-size: 3rem;
  }
  .entries-container {
   
  }
</style>
