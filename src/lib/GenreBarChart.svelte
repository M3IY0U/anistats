<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./util/AnimeEntry";
  import { onMount } from "svelte";

  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;
  let occurrences: Map<string, Number>;
  let data: any;
  let bc: Bar;

  export const updateChart = () => {
    if (entries.length > 0) {
      occurrences = new Map(
        [
          ...entries
            .flatMap((x) => x.genres)
            .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
            .entries(),
        ].sort((a, b) => b[1] - a[1])
      );
    }
    data = {
      labels: Array.from(occurrences.keys()),
      datasets: [
        {
          label: " # of genre occurrence",
          data: Array.from(occurrences.values()),
          backgroundColor: ["rgba(2, 169, 255, 0.5)"],
          borderColor: ["rgb(255, 255, 255)"],
          borderWidth: 2,
        },
      ],
    };

    if (bc != undefined) bc.data = data;
  };

  onMount(() => {
    updateChart();
  });
</script>

{#if data}
  <div class="container">
    <span>Genre Occurrences</span>
    <Bar
      bind:this={bc}
      {data}
      width={800}
      height={500}
      options={{
        onClick: (_, arr) => {
          if (arr.length > 0) {
            let label = data.labels[arr[0].index];
            window.open(
              `https://anilist.co/search/anime?genres=${label}&only%20show%20my%20anime=true`,
              "_blank"
            );
          }
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: false,
      }}
    />
  </div>
{/if}

<style>
  .container {
    text-align: center;
  }
</style>
