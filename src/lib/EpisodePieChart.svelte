<script lang="ts">
  import { Pie } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./AnimeEntry";
  import { onMount } from "svelte";
  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;
  let episodes: Map<Number, Number>;
  let data: any;
  let pc: Pie;

  onMount(() => {
    updateChart();
  });

  export const updateChart = () => {
    if (entries.length > 0) {
      episodes = new Map(
        [
          ...entries
            .flatMap((x) => x.episodes)
            .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
            .entries(),
        ].sort((a, b) => b[1] - a[1])
      );
    }
    data = {
      labels: Array.from(episodes.keys()),
      datasets: [
        {
          label: "# of episodes",
          data: Array.from(episodes.values()),
          backgroundColor: ["rgba(2, 169, 255, 0.5)"],
          borderColor: ["rgb(255, 255, 255)"],
          borderWidth: 2,
        },
      ],
    };

    if (pc != undefined) pc.data = data;
  };
</script>

{#if data}
  <Pie
    bind:this={pc}
    {data}
    width={350}
    height={350}
    options={{ responsive: true }}
  />
{/if}
