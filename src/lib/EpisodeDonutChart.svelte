<script lang="ts">
  import { Doughnut } from "svelte-chartjs";
  import { Chart, registerables } from "chart.js";
  import { animeToggle, entries } from "./util/stores";
  import { BG_COLOR, BORDER_COLOR } from "./util/constants";
  Chart.register(...registerables);

  let episodes: Map<Number, Number>;
  let data: any;
  let pc: Doughnut;
  let animeGroups = [
    [1, 1],
    [2, 6],
    [7, 16],
    [17, 38],
    [39, 55],
    [56, 100],
    [100, 1000000],
  ];

  let mangaGroups = [
    [1, 1],
    [2, 10],
    [11, 25],
    [26, 50],
    [51, 100],
    [101, 200],
    [201, 1000000],
  ];

  const lbc = (item) => {
    return ` ${item.formattedValue} entr${
      item.formattedValue == "1" ? "y" : "ies"
    } with ${item.label} ${$animeToggle ? "episodes" : "chapters"}`;
  };

  const groupEntries = (isAnime: boolean) => {
    let grouped = [];
    if (isAnime) {
      for (const range of animeGroups) {
        grouped.push([
          range,
          $entries.filter(
            (x) => x.episodes >= range[0] && x.episodes <= range[1]
          ),
        ]);
      }
    } else {
      for (const range of mangaGroups) {
        grouped.push([
          range,
          $entries.filter(
            (x) => x.chapters >= range[0] && x.chapters <= range[1]
          ),
        ]);
      }
      grouped.push(["Unknown", $entries.filter((x) => x.chapters)]);
    }
    return grouped;
  };

  export const updateChart = () => {
    if ($entries.length < 1) return;
    let grouped = groupEntries($animeToggle);

    episodes = new Map(grouped.map((x) => [x[0], x[1].length]));

    let labels = grouped.map((x) => `${x[0][0]}-${x[0][1]}`);

    if ($animeToggle) {
      labels[0] = "1";
      labels[6] = "100+";
    } else {
      labels[0] = "1";
      labels[6] = "200+";
    }
    labels[7] = "an unknown amount of";

    data = {
      labels: labels,
      datasets: [
        {
          label: `${$animeToggle ? "Episode" : "Chapter"} Counts`,
          data: Array.from(episodes.values()),
          backgroundColor: [BG_COLOR],
          borderColor: [BORDER_COLOR],
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
    <span class="title">{$animeToggle ? "Episode" : "Chapter"} counts</span>
    <Doughnut
      bind:this={pc}
      {data}
      width={650}
      height={450}
      options={{
        onClick: (_, arr) => {
          if (arr.length > 0) {
            let count = [...episodes.keys()].at(arr[0].index);
            console.log(count);

            let media = $animeToggle ? "anime" : "manga";
            let mediaDiv = $animeToggle ? "episodes" : "chapters";
            window.open(
              `https://anilist.co/search/${media}?only%20show%20my%20${media}=true&${mediaDiv}=${count[0]}&${mediaDiv}=${count[1]}`,
              "_blank"
            );
          }
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
          x: {
            ticks: {
              color: "transparent",
            },
            grid: {
              display: true,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
            },
          },
          y: {
            ticks: {
              color: "transparent",
            },
            grid: {
              display: true,
              drawBorder: false,
              drawOnChartArea: true,
              drawTicks: true,
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
