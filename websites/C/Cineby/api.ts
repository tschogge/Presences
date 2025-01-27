/* eslint-disable camelcase */
// Hack to resolve Deepscan
const no_op = (a: number) => a + 1;
no_op(0);

export interface Details {
	poster_path?: string;
}

export interface TvDetails extends Details {
	name?: string;
	season_poster?: string;
	episode_title?: string;
	episode_number?: number;
	season_number?: number;
}

export interface EpisodeDetails {
	name: string;
	episode_number: number;
	season_number: number;
}

export interface MovieDetails extends Details {
	title?: string;
	release_date?: string;
	runtime?: number;
}

export interface AnimeDetails {
	details: {
		title: string;
		thumbnail: string;
		episodes: {
			episode: number;
			title: string;
		}[];
	};
}

const cache: Map<string, TvDetails | MovieDetails | AnimeDetails> = new Map();

export class CinebyApi {
	private static readonly BASE_URL = "https://db.cineby.app/3";
	private static readonly API_KEY = "269890f657dddf4635473cf4cf456576";

	private static readonly ANIME_URL = "https://api.cineby.app/hianime";

	public static async getCurrent<T extends TvDetails | MovieDetails>(
		pathname: string
	): Promise<T> {
		if (cache.has(pathname)) return cache.get(pathname) as T;

		const [type, id] = pathname.split("/").slice(1),
			response = await fetch(
				`${this.BASE_URL}/${type}/${id}?language=en&api_key=${this.API_KEY}`
			);

		if (type === "tv") {
			const json = await response.json(),
				episode = await this.getCurrentEpisode(pathname),
				returnData = {
					...json,
					season_poster: json.seasons[episode.season_number - 1].poster_path,
					episode_title: episode.name,
					episode_number: episode.episode_number,
					season_number: episode.season_number,
				} as T;

			cache.set(pathname, returnData);

			return returnData;
		}

		const json = await response.json();
		cache.set(pathname, json);

		return json;
	}

	private static async getCurrentEpisode(
		pathname: string
	): Promise<EpisodeDetails> {
		const [id, season, episode] = pathname.split("/").slice(2),
			response = await fetch(
				`${this.BASE_URL}/tv/${id}/season/${season ?? 1}/episode/${
					episode ?? 1
				}?language=en&api_key=${this.API_KEY}`
			);

		return response.json();
	}

	public static async getCurrentAnime(pathname: string): Promise<AnimeDetails> {
		if (cache.has(pathname)) return cache.get(pathname) as AnimeDetails;

		const { search } = document.location,
			id = pathname.split("/")[2],
			response = await fetch(
				`${
					this.ANIME_URL
				}/sources-with-id?providerId=${id}&dub=${new URLSearchParams(
					search
				).get("dub")}`
			);

		cache.set(pathname, await response.json());

		return response.json();
	}
}
