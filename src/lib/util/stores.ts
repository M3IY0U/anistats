import { writable } from "svelte/store";
import type { AnimeEntry } from "./AnimeEntry";

export const animeToggle = writable(true)

export const entries = writable(new Array<AnimeEntry>());