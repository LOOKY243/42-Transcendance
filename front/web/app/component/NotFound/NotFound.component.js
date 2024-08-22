import { AComponent } from "../../../spa/component/AComponent.js";

export class NotFoundComponent extends AComponent {
	getCSSPath() {
		return "app/component/NotFound/NotFound.component.css";
	}
	
	onInit() {
		super.onInit();
		this.generateHtml({});
		this.setConfig({
			notFoundText: this.translate("notFound.text")
		});
	}

	generateHtml(config) {
		this.html = `<h1 class='NotFound__title'>Error 404</h1><span>${config.notFoundText}</span>`;
	}

	getChildComponent() {
		return [];
	}
}