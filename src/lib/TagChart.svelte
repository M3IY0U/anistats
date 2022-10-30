<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { createOnClickLink } from "./util/AnimeEntry";
  import { onMount } from "svelte";
  import { Bar } from "svelte-chartjs";
  import Slider from "./external/Slider.svelte";
  import { animeToggle, entries } from "./util/stores";

  Chart.register(...registerables);

  const lbc = (item) => {
    return ` ${item.formattedValue}% "${descriptions.get(item.label)}"`;
  };

  let data: any;
  let tc: Bar;
  let value = [0, 100];
  let descriptions: Map<string, string>;

  export const updateChart = () => {
    descriptions = new Map([
      ...$entries
        .flatMap((x) => x.tags)
        .reduce((acc, e) => acc.set(e.name, e.description), new Map()),
    ]);

    let occurrences = new Map(
      [
        ...$entries
          .flatMap((x) => x.tags)
          .filter((f) => f.rank > value[0])
          .reduce(
            (acc, e) => acc.set(e.name, (acc.get(e.name) || 0) + e.rank / 100),
            new Map()
          )
          .entries(),
      ]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    );

    let res = Array.from(occurrences).map(([k, v]) =>
      ((100 * v) / $entries.length).toFixed(1)
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

  entries.subscribe(() => {
    updateChart();
  });
</script>

{#if data}
  <div class="container">
    <span class="title">% of {$animeToggle ? "Anime" : "Manga"} with tag</span>
    <Bar
      bind:this={tc}
      {data}
      width={800}
      height={450}
      options={{
        onClick: (_, arr) => {
          if (arr.length > 0) {
            let label = data.labels[arr[0].index];
            window.open(createOnClickLink(label, $animeToggle), "_blank");
          }
        },
        animation: {
          delay: 250,
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
      }}
    />
    You can use this slider to adjust the threshold that tags need to be counted,
    currently at: {value[0]}%
    <Slider max={100} min={0} step={1} bind:value on:input={updateChart} />
  </div>
{/if}

<style>
  .container {
    text-align: center;
  }
</style>
