<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import { createDateClickLink } from "./util/AnimeEntry";
  import { animeToggle } from "./util/stores";
  import { entries } from "./util/stores";
  import { BG_COLOR, BORDER_COLOR, FONT_COLOR } from "./util/constants";

  Chart.register(...registerables);

  let dates: Map<number, number>;
  let data: any;
  let bc: Bar;

  export const updateChart = () => {
    if ($entries.length > 0) {
      dates = new Map(
        [
          ...$entries
            .flatMap((x) => x.startYear)
            .filter((d) => d != null)
            .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
            .entries(),
        ].sort((a, b) => a[0] - b[0])
      );
    }

    data = {
      labels: Array.from(dates.keys()),
      datasets: [
        {
          label: " entrie(s) started this year",
          data: Array.from(dates.values()),
          backgroundColor: [BG_COLOR],
          borderColor: [BORDER_COLOR],
          borderWidth: 2,
        },
      ],
    };

    if (bc != undefined) bc.data = data;
  };

  entries.subscribe(() => {
    updateChart();
  });
</script>

{#if data}
  <div class="container">
    <span>Starting Dates</span>
    <Bar
      bind:this={bc}
      {data}
      width={800}
      height={500}
      options={{
        onClick: (_, arr) => {
          if (arr.length > 0) {
            let label = data.labels[arr[0].index];
            window.open(createDateClickLink(label, $animeToggle), "_blank");
          }
        },
        plugins: {
          legend: {
            display: false,
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
