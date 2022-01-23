import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetch from "cross-fetch";


@Injectable()
export class HueService {
	private hueUrl: string | undefined;

	constructor(
		private configService: ConfigService,
	) {
		this.hueUrl = this.configService.get("HUE_URL");
		this.getLight(1);
	}

	private async get<T>(url: string): Promise<T> {
		if (!this.hueUrl) {
			throw new Error("HUE_URL not set");
		}
		const res = (await fetch(this.hueUrl + url));
		return res.json() as Promise<T>;
	}

	public async getLight(lightNum: number) {
		const light = await this.get(`/lights/${lightNum}`);
	}

}