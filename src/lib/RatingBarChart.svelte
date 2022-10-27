<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./AnimeEntry";
  import { onMount } from "svelte";
  import { groupBy } from "./Util";
  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;
  let ratings: any;
  let data: any;
  let rc: Bar;

  onMount(() => {
    updateChart();
  });

  export const updateChart = () => {
    if (entries.length < 1) return;

    let meanScores = entries.map((x) => x.meanScore).sort();
    let avgScores = entries.map((x) => x.avgScore).sort();

    let groupedMean = groupBy(meanScores, (x: number) => Math.floor(x / 10));
    let groupedAvg = groupBy(avgScores, (x: number) => Math.floor(x / 10));

    let resMean = Array(10).fill(0);
    let resAvg = Array(10).fill(0);

    groupedMean.forEach((x: Array<Number>) => {
      resMean[x[0].toString()[0]] = x.length;
    });
    groupedAvg.forEach((x: Array<Number>) => {
      resAvg[x[0].toString()[0]] = x.length;
    });

    data = {
      labels: [...Array(10).keys()],
      datasets: [
        {
          label: "Mean Score",
          data: resMean,
          backgroundColor: ["rgba(2, 169, 255, 0.5)"],
          borderColor: ["rgb(255, 255, 255)"],
          borderWidth: 1,
        },
        {
          label: "Average Score",
          data: resAvg,
          backgroundColor: ["rgba(185, 31, 31, 0.87)"],
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
      width={450}
      height={450}
      options={{
        plugins: {
          legend: {
            display: true,
          },
        },
        responsive: true,
      }}
    />
  </div>
{/if}

<style>
  .container {
    text-align: center;
  }
</style>
