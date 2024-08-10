import { AComponent } from "../../../spa/component/AComponent.js";

export class NotFoundComponent extends AComponent {
	getCSSPath() {
		return "app/component/NotFound/NotFound.component.css";
	}
	
	onInit() {
		super.onInit();
		this.generateHtml({});
	}

	generateHtml(config) {
		this.html = "<h1 class='NotFound__title'>Error 404</h1><span>Page not found</span>";
	}

	getChildComponent() {
		return [];
	}
}