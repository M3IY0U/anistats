import { gql } from "graphql-request";
import { request } from "graphql-request";
import {AnimeEntry } from "./AnimeEntry.ts";

export class Queries {
  public static async fetchData(username: string) {
    let entries = [];
    let result = await request(
      Queries.apiUrl,
      Queries.retrieveList.replace("$id", username)
    );
    for (const list of result.MediaListCollection.lists) {
      if (list.name != "Completed" && list.name != "Watching") continue;
      list.entries.forEach((entry: any) => {
        entry = entry.media;
        entries.push(
          new AnimeEntry(
            list.name,
            entry.title.romaji,
            entry.coverImage.extraLarge,
            entry.siteUrl,
            entry.genres,
            entry.episodes
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
            }
          }
        }
      }
    }
  `;
}
