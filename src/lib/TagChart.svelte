<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./util/AnimeEntry";
  import { onMount } from "svelte";
  import { Bar } from "svelte-chartjs";

  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;
  const lbc = (item) => {
    return ` ${item.formattedValue}%`;
  };

  let data: any;
  let tc: Bar;

  onMount(() => {
    updateChart();
  });

  export const updateChart = () => {
    
    let occurrences = new Map(
      [
        ...entries
          .flatMap((x) => x.tags)
          .filter(f => f.rank > 50)
          .reduce(
            (acc, e) => acc.set(e.name, (acc.get(e.name) || 1) + 1),
            new Map()
          )
          .entries(),
      ]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    );

    let res = Array.from(occurrences).map(([k, v]) =>
      ((v / entries.length) * 100).toFixed(1)
    );

    data = {
      labels: [...occurrences.keys()],
      datasets: [
        {
          label: "% of tag occurrence",
          data: [...res.values()],
          backgroundColor: ["rgba(2, 169, 255, 0.5)"],
          borderColor: ["rgb(255, 255, 255)"],
          borderWidth: 2,
        },
      ],
    };
  };
</script>

{#if data}
  <div class="container">
    <span class="title">% of Anime with tag</span>
    <Bar
      bind:this={tc}
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
      }}
    />
  </div>
{/if}

<style>
  .container {
    text-align: center;
  }
</style>
