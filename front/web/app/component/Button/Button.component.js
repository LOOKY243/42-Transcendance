import { AComponent } from "../../../spa/component/AComponent.js"
import { Observable } from "../../../spa/utils/Observable.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";

export class ButtonComponent extends AComponent {
	buttonText = new ReplayObservable();

	initConfig() {
		this.setConfig({
			text: this.buttonText
		});
	}

	getCSSPath() {
		return "app/component/Button/Button.component.css";
	}

	getChildComponent() {
		return [];
	}

	generateHtml(calculatedConfig) {
		this.html = `<button class='atom__button'>${calculatedConfig.text}</button>`
	}
}