import { Controller, Get, Post } from "@nestjs/common";
import { ICurrentlyPlayingSong } from "src/services/spotify.service";
import { MeService } from "./me.service";

@Controller("me")
export class MeController {
	constructor(
		private readonly meService: MeService,
	) { }

	@Get()
	get(): string {
		return "Tyler Tracy"
	}

	@Get("/creations")
	getCreations() {
		return this.meService.creations();
	}

	@Get("/listening-to")
	getListeningTo(): Promise<ICurrentlyPlayingSong> {
		return this.meService.listeningTo();
	}


}
