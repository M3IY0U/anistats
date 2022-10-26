import { gql } from 'graphql-request';

export class Queries {
	public static readonly apiUrl = 'https://graphql.anilist.co';
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
