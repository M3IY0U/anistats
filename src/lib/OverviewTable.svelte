<script lang="ts">
  import { animeToggle } from "./util/stores";
  import { entries } from "./util/stores";
  import { onMount } from "svelte";

  let tableEntries = $entries;

  entries.subscribe(() => {
    tableEntries = $entries;
  });

  let sortBy = { col: "title", asc: true };

  let sort = (col: string) => {
    if (sortBy.col == col) {
      sortBy.asc = !sortBy.asc;
    } else {
      sortBy.col = col;
      sortBy.asc = true;
    }
    let sortModifier = sortBy.asc ? 1 : -1;

    let sort = (a, b) =>
      a[col] < b[col]
        ? -1 * sortModifier
        : a[col] > b[col]
        ? 1 * sortModifier
        : 0;

    tableEntries = tableEntries.sort(sort);
  };

  onMount(() => {
    let elements = document.getElementsByClassName("table-title");
    for (const element of elements) {
      element.addEventListener("mouseenter", (event: any) => {
        let hover = document.createElement("div");
        hover.id = "hover-image";
        hover.className = "hover-image";

        hover.style.backgroundImage = `url("${
          tableEntries.find((x) => x.id == event.target.id).image
        }")`;

        document.body.appendChild(hover);
      });

      element.addEventListener("mousemove", (e: MouseEvent) => {
        let element = document.getElementById("hover-image");
        element.style.left = e.pageX + 10 + "px";
        element.style.top = e.pageY - 500 + "px";
      });

      element.addEventListener("mouseout", (event: any) => {
        document.body.removeChild(document.getElementById("hover-image"));
      });
    }
  });
</script>

<table>
  <thead>
    <tr>
      <th on:click={() => sort("title")}>Title</th>
      <th on:click={() => sort("startYear")}>Year</th>
      <th on:click={() => sort("status")}>Status</th>
      <th on:click={() => sort(`${$animeToggle ? "episodes" : "chapters"}`)}
        >Progress</th
      >
      <th on:click={() => sort("format")}>Format</th>
      <th on:click={() => sort("genres")}>Genres</th>
    </tr>
  </thead>
  <tbody>
    {#each tableEntries as entry}
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <td
          ><span
            class="table-title"
            id={entry.id.toString()}
            on:click={() => window.open(entry.url, "_blank")}
            >{entry.title}</span
          ></td
        >
        <td>{entry.startYear}</td>
        <td>{entry.status}</td>
        <td
          >{entry.progress}/{$animeToggle ? entry.episodes : entry.chapters}</td
        >
        <td>{entry.format}</td>
        <td>{entry.genres.join(", ")}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  :global(.hover-image) {
    width: 320px;
    height: 480px;
    border: 4px solid black;
    border-radius: 10px;
    background-size: cover;
    position: absolute;
    display: block;
    transition: all 50ms ease;
  }
  table,
  th,
  td {
    border: 1px solid rgba(2, 169, 255, 0.5);
    border-collapse: collapse;
    padding: 2px;
    cursor: default;
    border-radius: 10px;
  }

  td:first-child {
    cursor: pointer;
  }
  th {
    cursor: pointer;
  }
  table {
    width: 90%;
    text-align: center;
  }
</style>
