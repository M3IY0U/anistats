export class AnimeEntry {
  status: string;
  title: string;
  image: string;
  url: string;
  genres: string[];
  episodes: Number;
  averageScore: number

  constructor(
    status: string,
    title: string,
    image: string,
    url: string,
    genres: string[],
    episodes: Number,
    averageScore: number
  ) {
    this.status = status;
    this.title = title;
    this.image = image;
    this.url = url;
    this.genres = genres;
    this.episodes = episodes;
    this.averageScore= averageScore;
  }
}
