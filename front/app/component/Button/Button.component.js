import { AComponent } from "../../../spa/component/AComponent.js"

export class ButtonComponent extends AComponent {
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