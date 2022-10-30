<script lang="ts">
  import { Scatter } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { entries } from "./util/stores";
  Chart.register(...registerables);

  let episodes: Map<Number, Number>;
  let data: any;
  let pc: Scatter;
  const lbc = (item) => {
    return ` ${item.formattedValue} entries with ${item.label} episodes`;
  };

  export const updateChart = () => {
    if ($entries.length > 0) {
      episodes = new Map(
        [
          ...$entries
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

  entries.subscribe(() => {
    updateChart();
  });
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
        onClick: (_, arr) => {
          if (arr.length > 0) {
            let label = data.datasets[0].data[arr[0].index].x;
            window.open(
              `https://anilist.co/search/anime?only%20show%20my%20anime=true&episodes=${label}&episodes=${label}`,
              "_blank"
            );
          }
        },
        elements: {
          point: {
            pointStyle: "",
            radius: 8,
            hoverRadius: 12,
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
