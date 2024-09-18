import { AComponent } from "../../../spa/component/AComponent.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";
import { IconComponent } from "../Icon/Icon.component.js";

export class ButtonIconComponent extends AComponent {
	style = new ReplayObservable();
	disabled = new ReplayObservable();

	initConfig() {
		this.setConfig({
			style: this.style,
			disabled: this.disabled
		});
	}

	static create(value) {
		let ret = new ButtonIconComponent(value.parentSelector, value.name);
		if (value.onclick) {
			ret.onClick.subscribe(value.onclick);
		}
		ret.createSubComponent(IconComponent.create({
			name: "icon",
			parentSelector: ret.getSelector(),
			icon: value.icon
		}));
		ret.style.next(value.style);
		ret.disabled.next(false);
		return ret
	}
	
	generateHtml(config) {
		this.html = `
			<button id="icon" type="button" class="${config.style}" ${config.disabled ? "disabled" : ""}></button>
		`;
	}
}