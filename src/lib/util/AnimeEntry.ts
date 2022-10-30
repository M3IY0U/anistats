export class AnimeEntry {
  status: string;
  title: string;
  image: string;
  url: string;
  genres: string[];
  episodes: number;
  stats: Array<{score: number, amount: number}>;
  tags: Array<{ name: string; rank: number, description: string }>;

  constructor(
    status: string,
    title: string,
    image: string,
    url: string,
    genres: string[],
    episodes: number,
    stats: Array<{score: number, amount: number}>,
    tags: Array<{ name: string; rank: number, description: string }>
  ) {
    this.status = status;
    this.title = title;
    this.image = image;
    this.url = url;
    this.genres = genres;
    this.episodes = episodes;
    this.stats = stats;
    this.tags = tags;
  }
}
