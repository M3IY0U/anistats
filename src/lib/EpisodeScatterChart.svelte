<script lang="ts">
  import { Scatter } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./util/AnimeEntry";
  import { onMount } from "svelte";
  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;
  let episodes: Map<Number, Number>;
  let data: any;
  let pc: Scatter;

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
      datasets: [
        {
          label: "Episode Counts",
          data: Array.from(episodes.entries(), ([k, v]) => ({ x: k, y: v })),
          backgroundColor: ["rgba(2, 169, 255, 0.5)"],
          borderColor: ["rgb(255, 255, 255)"],
          borderWidth: 1,
        },
      ],
    };

    if (pc != undefined) pc.data = data;
  };
</script>

{#if data}
  <div class="container">
    <span class="title">Episode counts</span>
    <Scatter
      bind:this={pc}
      {data}
      width={650}
      height={450}
      options={{
        elements: {
          point: {
            pointStyle: "triangle",
            radius: 12,
            hoverRadius: 20,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Amount of entries",
            },
          },
          x: {
            title: {
              display: true,
              text: "Episode Count",
            },
          },
        },
      }}
    />
  </div>
{/if}

<style>
  .container {
    text-align: center;
  }
</style>
