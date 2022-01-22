import { Controller, Get } from "@nestjs/common";
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

	@Get("/listening-to")
	getListeningTo() {
		return this.meService.listeningTo();
	}


}
