import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";
import { UserService } from "../../service/User.service.js";

export class profilePictureComponent extends AComponent {
	pfp = injector[UserService].pfp;
	pfpUrl = new ReplayObservable();

	onInit() {
		super.onInit();
		this.generateHtml({});

		this.pfpUrl.next(this.pfp.isEmpty() ? `https://${document.location.host}/app/assets/icon/defaultPP.svg` : injector[UserService].user.pfp);
		
		this.setConfig({
			pfpUrl: this.pfpUrl
		});

		return true;
	}

	getCSSPath() {
		return "app/component/ProfilePicture/ProfilePicture.component.css";
	}

	generateHtml(config) {
		this.html = `
			<img class="pfpImg" src="${config.pfpUrl}">
		`;
	}
}