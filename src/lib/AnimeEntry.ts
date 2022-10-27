export class AnimeEntry {
    status: string;
    title: string;
    image: string;
    url: string;
    genres: string[];
    episodes: Number
    meanScore: Number
    avgScore: Number

  constructor(
    status: string, 
    title: string, 
    image: string, 
    url: string, 
    genres: string[],
    episodes: Number,
    meanScore: Number,
    avgScore: Number
) {
    this.status = status
    this.title = title
    this.image = image
    this.url = url
    this.genres = genres
    this.episodes = episodes
    this.meanScore = meanScore
    this.avgScore = avgScore
  }

}