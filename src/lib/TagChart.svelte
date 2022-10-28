<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import type { AnimeEntry } from "./util/AnimeEntry";
  import { onMount } from "svelte";

  Chart.register(...registerables);

  export let entries: Array<AnimeEntry>;

    
  
</script>
