<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./util/AnimeEntry";
  import { onMount } from "svelte";
  import { range } from "./util/ArrayFunctions";
  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;

  let data: any;
  let rc: Bar;

  onMount(() => {
    updateChart();
  });

  export const updateChart = () => {
    if (entries.length < 1) return;

    console.log(entries);
    let min = Math.min(...entries.map(x => x.averageScore))
    let max = Math.max(...entries.map(x => x.averageScore))

    let x = new Map(range(min,max).map(i => [i, 0]))

    console.log(x)
    for (const entry of entries) {
      x.set(entry.averageScore, x.get(entry.averageScore) + 1);
    }
      console.log(x)

    data = {
      labels: range(min, max),
      datasets: [
        {
          label: "Ratings",
          data: [...x.values()],
          backgroundColor: ["rgba(2, 169, 255, 0.5)"],
          borderColor: ["rgb(255, 255, 255)"],
          borderWidth: 1,
        },
      ],
    };

    if (rc != undefined) rc.data = data;
  };
</script>

{#if data}
  <div class="container">
    <span class="title">Ratings</span>
    <Bar
      bind:this={rc}
      {data}
      width={800}
      height={450}
      options={{
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
