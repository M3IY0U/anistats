import { gql } from "graphql-request";
import { request } from "graphql-request";
import { AnimeEntry } from "./AnimeEntry";

export class Queries {
  public static async fetchData(username: string) {
    let entries = [];
    let result = await request(
      this.apiUrl,
      this.retrieveList.replace("$id", username)
    );
    for (const list of result.MediaListCollection.lists) {
      if (!list.name.startsWith("Completed") && !list.name.startsWith("Watching")) continue;
      list.entries.forEach((entry: any) => {
        entry = entry.media;
        entries.push(
          new AnimeEntry(
            list.name,
            entry.title.romaji,
            entry.coverImage.extraLarge,
            entry.siteUrl,
            entry.genres,
            entry.episodes,
            entry.stats.scoreDistribution,
            entry.tags
          )
        );
      });
    }
    return entries;
  }

  public static readonly apiUrl = "https://graphql.anilist.co";
  public static readonly retrieveList = gql`
    {
      MediaListCollection(userName: "$id", type: ANIME) {
        lists {
          name
          entries {
            id
            media {
              title {
                romaji
              }
              genres
              coverImage {
                extraLarge
              }
              siteUrl
              episodes
              stats {
                scoreDistribution {
                  score
                  amount
                }
              }
              tags {
                name
                rank
              }
            }
          }
        }
      }
    }
  `;
}
