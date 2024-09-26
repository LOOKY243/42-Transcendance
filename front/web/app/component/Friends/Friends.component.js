import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { UserService } from "../../service/User.service.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";

export class FriendsComponent extends AComponent {
	friends = injector[UserService].friendsList

	onInit() {
		if (!injector[UserService].user) {
            injector[Router].navigate("/auth");
			return false;
        }

		super.onInit();
		this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		Object.keys(injector[UserService].user.friendsList).forEach(id => {
			const friend = injector[UserService].user.friendsList[id];
			console.log(friend.name);
		});

		this.setConfig({
			hasFriends: this.friends,
			noFriends: this.translate("friends.noFriends"),
		});

		return true;
	}

	generateHtml(config) {
		this.html = `
			<div id="navbar"></div>
			<div class="container">
				<div class="containerBlur mt-5">
					<div class="fs-4 fw-semibold text-danger text-center p-5" style="${config.hasFriends ? `display: none;` : ``};">${config.noFriends}</div>
					<div style="${config.hasFriends ? `` : `display: none;`};">FRIENDS LIST</div>
				</div>
			</div>
		`;
	}
}