<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import { createGenreClickLink } from "./util/AnimeEntry";
  import { animeToggle } from "./util/stores";
  import { entries } from "./util/stores";
  import { BG_COLOR, BORDER_COLOR, FONT_COLOR } from "./util/constants";

  Chart.register(...registerables);

  let occurrences: Map<string, Number>;
  let data: any;
  let bc: Bar;

  export const updateChart = () => {
    if ($entries.length > 0) {
      occurrences = new Map(
        [
          ...$entries
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
            window.open(createGenreClickLink(label, $animeToggle), "_blank");
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
