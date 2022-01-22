import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import SpotifyWebApi from "spotify-web-api-node";
import { Cache } from "src/utils/utils";

enum ISongState {
	PLAYING = "PLAYING",
	NOT_PLAYING = "NOT_PLAYING"
}

interface ISimpleTrack {
	name: string;
	artistName: string;
	imageUrl: string;
}

interface ISpotifyImage {
	height: number;
	width: number;
	url: string;
}

export interface ICurrentlyPlayingSong extends ISimpleTrack {
	state: ISongState;
}

interface Response<T> {
	body: T;
	headers: Record<string, string>;
	statusCode: number;
}

@Injectable()
export default class SpotifyService {

	public api: SpotifyWebApi;

	constructor(
		private configService: ConfigService
	) {
		const clientId = this.configService.get<string>("SPOTIFY_CLIENT_ID");
		const clientSecret = this.configService.get<string>("SPOTIFY_SECRET_ID");

		if (!clientId || !clientSecret) {
			throw new Error("Client ID or Client Secret not found");
		}

		this.api = new SpotifyWebApi({
			clientId,
			clientSecret,
			redirectUri: 'http://www.example.com/callback'
		});
	}


	public async auth(tokens: { accessToken: string, refreshToken: string }) {
		this.api.setAccessToken(tokens.accessToken);
		this.api.setRefreshToken(tokens.refreshToken);
	}

	private async call<T>(call: (api: SpotifyWebApi) => Promise<Response<T>>): Promise<T> {
		const data = await call(this.api);
		if (data.statusCode == 200) {
			return data.body;
		}
		throw new Error("Could not make spotify call");
	}

	private currentSongCache = new Cache<ICurrentlyPlayingSong>(10000);
	public async getCurrentSong(): Promise<ICurrentlyPlayingSong> {

		if (this.currentSongCache.value) {
			return Promise.resolve(this.currentSongCache.value);
		}

		const simplifyTrack = (track: SpotifyApi.TrackObjectFull): ISimpleTrack => {
			let smallestImage: ISpotifyImage = { height: Infinity, width: Infinity, url: "" };
			for (const image of track.album.images) {
				const height = image.height;
				const width = image.width;
				if (!height || !width) {
					continue;
				}
				if (height < smallestImage.height) {
					smallestImage = {
						height,
						width,
						url: image.url
					};
				}
			}

			return {
				name: track.name,
				artistName: track.artists[0].name,
				imageUrl: smallestImage.url
			};
		}

		const currentSong = await this.call(api => api.getMyCurrentPlaybackState());

		if (!currentSong.item || currentSong.item.type === "episode") {
			const pastSongs = await this.call(api => api.getMyRecentlyPlayedTracks());
			const mostRecentTrackSmall = pastSongs.items[0].track;
			const mostRecentTrack = await this.call(api => api.getTrack(mostRecentTrackSmall.id));
			const simpleTrack = simplifyTrack(mostRecentTrack);
			return {
				state: ISongState.NOT_PLAYING,
				...simpleTrack,
			}
		}

		return {
			state: currentSong.is_playing ? ISongState.PLAYING : ISongState.NOT_PLAYING,
			...simplifyTrack(currentSong.item),
		}
	}

}
