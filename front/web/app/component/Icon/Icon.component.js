import { AComponent } from "../../../spa/component/AComponent.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";

export class IconComponent extends AComponent {
	icon = new ReplayObservable();
	clickable = new ReplayObservable();
	
	iconList = {
		"chat": "chat-left-text.svg",
		"settings": "gear.svg",
		"french": "FrenchFlag.svg",
		"english": "UKingdomFlag.svg",
		"italian": "ItalyFlag.svg",
		"pause": "bi-pause.svg",
		"play": "bi-play.svg",
		"playFill": "bi-play-fill.svg",
		"arrow": "arrow.svg",
		"defaultProfilePicture": "defaultPP.svg",
		"modifier": "modifier.svg"
	}

	initConfig() {
		this.setConfig({
			icon: this.icon,
			clickable: this.clickable
		});
	}

	static create(value) {
		let ret = new IconComponent(value.parentSelector, value.name);
		if (value.onclick) {
			ret.onClick.subscribe(value.onclick);
			ret.clickable.next(true);
		}
		ret.icon.next(value.icon);
		return ret;
	}

	generateHtml(config) {
		this.html = `
			<img style="cursor:${config.clickable ? "pointer" : "inherit"};" src="http://${document.location.host}/app/assets/icon/${this.iconList[config.icon]}">
		`
	}
}