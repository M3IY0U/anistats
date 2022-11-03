import { gql, request } from "graphql-request";
import { AnimeEntry } from "./AnimeEntry";

export class Queries {
  public static async fetchData(username: string, anime: boolean) {
    let entries = [];
    let result = await request(
      this.apiUrl,
      this.retrieveList
        .replace("$id", username)
        .replace("TYPE", anime ? "ANIME" : "MANGA")
    );
    for (const list of result.MediaListCollection.lists) {
      list.entries.forEach((entry: any) => {
        let progress = entry.progress;
        entry = entry.media;
        entries.push(
          new AnimeEntry(
            entry.id,
            entry.format,
            progress,
            list.name,
            entry.title.romaji,
            entry.coverImage.extraLarge,
            entry.siteUrl,
            entry.genres,
            entry.episodes,
            entry.chapters,
            entry.stats.scoreDistribution,
            entry.tags,
            entry.startDate.year
          )
        );
      });
    }
    return entries;
  }

  public static readonly apiUrl = "https://graphql.anilist.co";
  public static readonly retrieveList = gql`
    {
      MediaListCollection(userName: "$id", type: TYPE) {
        lists {
          name
          entries {
            progress
            media {
              id
              format
              title {
                romaji
              }
              genres
              coverImage {
                extraLarge
              }
              siteUrl
              episodes
              chapters
              stats {
                scoreDistribution {
                  score
                  amount
                }
              }
              tags {
                name
                rank
                description
              }
              startDate {
                year
              }
            }
          }
        }
      }
    }
  `;
}
