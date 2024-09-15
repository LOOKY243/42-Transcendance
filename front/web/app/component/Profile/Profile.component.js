import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { Router } from "../../../spa/Router.js";
import { UserService } from "../../service/User.service.js";
import { IconComponent } from "../Icon/Icon.component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";
import { TablesComponent } from "../Tables/Tables.component.js";

export class ProfileComponent extends AComponent {
	username = injector[UserService].username;
	// history = injector[UserService].history;

	onInit() {
		if (injector[UserService].username.isEmpty()) {
            injector[Router].navigate("/auth");
			return false;
        }
		super.onInit();
		this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		this.createSubComponent(IconComponent.create({
			name: "profilePicture",
			parentSelector: this.getSelector(),
			icon: "defaultProfilePicture"
		}));
		this.createSubComponent(IconComponent.create({
			name: "profileSettings",
			parentSelector: this.getSelector(),
			icon: "settings",
			onclick: () => injector[Router].navigate("/profile/settings")
		}));

		this.createSubComponent(TablesComponent.create({
			name: "history",
			parentSelector: this.getSelector(),
			// history: this.history
		}));

		this.setConfig({
			username: this.username,
		});

		return true;
	}

	getCSSPath() {
		return "app/component/Profile/Profile.component.css"
	}

	generateHtml(config) {
		this.html = `
			<div id="navbar"></div>
			<div class="container">
				<div class="containerBlur mt-5">
					<div class="fs-2 fw-bold text-light m-4">
						<span>Profile</span>
					</div>
					<div class="row">
						<div class="col-md-2 d-flex align-items-center justify-content-center">
							<div id="profilePicture"></div>
						</div>
						<div class="col-md-2 d-flex align-items-center justify-content-center">
							<div class="fs-3 text-light p-3">${config.username ? config.username : "username"}</div>
						</div>
						<div class="col-md-4 offset-md-4 d-flex align-items-center justify-content-center">
							<div id="profileSettings" class="p-3"></div>
						</div>
					</div>
					<div class="line m-3"></div>
					<div class="m-3 d-flex justify-content-center">
						<div id="history" class="tablesContainer d-flex justify-content-center"></div>
					</div>	
				</div>
			</div>
		`;
	}
}