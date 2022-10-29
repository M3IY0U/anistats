<script lang="ts">
  import { Line } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./util/AnimeEntry";
  import { onMount } from "svelte";
  import { range } from "./util/ArrayFunctions";
  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;

  let data: any;
  let rc: Line;

  const lbc = (item) => {
    return ` ${item.formattedValue}%`;
  };

  onMount(() => {
    updateChart();
  });

  export const updateChart = () => {
    if (entries.length < 1) return;

    let dists = entries.map((e) => e.stats);

    let sums = entries.map((e) =>
      e.stats.reduce((partialSum, a) => partialSum + a.amount, 0)
    );

    let res = Array(10).fill(0);

    for (let i = 0; i < sums.length; i++) {
      for (const dist of dists[i]) {
        dist.amount /= sums[i];
      }
    }

    for (const dist of dists) {
      for (let i = 0; i < dist.length; i++) {
        res[i] += dist[i].amount;
      }
    }

    res = res.map((r) => parseFloat(((r / entries.length) * 100).toFixed(1)));

    data = {
      labels: [...range(1, 10)],
      datasets: [
        {
          label: "Ratings",
          data: res,
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
    <Line
      bind:this={rc}
      {data}
      width={800}
      height={450}
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: lbc,
            },
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
