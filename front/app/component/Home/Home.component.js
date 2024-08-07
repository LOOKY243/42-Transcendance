import { AComponent } from "../../../spa/component/AComponent.js"
import { ButtonComponent } from "../Button/Button.component.js"
import { Observable } from "../../../spa/utils/Observable.js"

export class HomeComponent extends AComponent {
	buttonText = null;
	button = null;

	onInit() {
		super.onInit();
		this.generateHtml({});
		this.buttonText = new Observable();
		this.button = new ButtonComponent(this.getSelector(), "button", {
			onClick: () => {
				window.history.pushState({}, "", "/user");
			}
		});
		this.button.setConfig({
			text: this.buttonText
		})
		this.buttonText.next("user page");
	}

	generateHtml(config) {
		this.html = "<h1>Home</h1>\n<div id='button'></div>";
	}

	getChildComponent() {
		return [this.button];
	}
}