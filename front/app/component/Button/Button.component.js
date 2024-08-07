import { AComponent } from "../../../spa/component/AComponent.js"

export class ButtonComponent extends AComponent {
	getChildComponent() {
		return [];
	}

	generateHtml(calculatedConfig) {
		this.html = `<button>${calculatedConfig.text}</button>`
	}
}