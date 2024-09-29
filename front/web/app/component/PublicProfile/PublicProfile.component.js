import { AComponent } from "../../../spa/component/AComponent.js";

export class PublicProfileComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});

		console.log(this.pathArgument);
		return true;
	}

	generateHtml(config) {
		this.html = `
			<div class="text-light">TEST</div>
		`;
	}
}