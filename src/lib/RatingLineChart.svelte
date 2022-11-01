<script lang="ts">
  import { Line } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import { range } from "./util/ArrayFunctions";
  import { entries } from "./util/stores";
  import { BG_COLOR, BORDER_COLOR, FONT_COLOR } from "./util/constants";
  Chart.register(...registerables);

  let data: any;
  let rc: Line;

  const lbc = (item) => {
    return ` ${item.formattedValue}%`;
  };

  export const updateChart = () => {
    if ($entries.length < 1) return;

    let dists = $entries.map((e) => e.stats);

    let sums = $entries.map((e) =>
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

    res = res.map((r) => parseFloat(((r / $entries.length) * 100).toFixed(1)));

    data = {
      labels: [...range(1, 10)],
      datasets: [
        {
          fill: "origin",
          label: "Ratings",
          data: res,
          backgroundColor: [BG_COLOR],
          borderColor: [BORDER_COLOR],
          borderWidth: 1,
        },
      ],
    };

    if (rc != undefined) rc.data = data;
  };

  entries.subscribe(() => {
    updateChart();
  });
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
        elements: {
          point: {
            pointStyle: "",
            radius: 5,
            hoverRadius: 12,
          },
          line: {
            tension: 0.35,
          },
        },
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
        scales: {
          y: {
            ticks: {
              color: FONT_COLOR,
            },
          },
          x: {
            ticks: {
              color: FONT_COLOR,
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
