export class AnimeEntry {
  status: string;
  title: string;
  image: string;
  url: string;
  genres: string[];
  episodes: number;
  averageScore: number;
  tags: Array<{ name: string; rank: number }>;

  constructor(
    status: string,
    title: string,
    image: string,
    url: string,
    genres: string[],
    episodes: number,
    averageScore: number,
    tags: Array<{ name: string; rank: number }>
  ) {
    this.status = status;
    this.title = title;
    this.image = image;
    this.url = url;
    this.genres = genres;
    this.episodes = episodes;
    this.averageScore = averageScore;
    this.tags = tags;
  }
}
