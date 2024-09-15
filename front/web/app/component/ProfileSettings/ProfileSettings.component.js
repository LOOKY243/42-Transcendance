import { AComponent } from "../../../spa/component/AComponent.js";
import { Observable } from "../../../spa/utils/Observable.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";
import { ButtonIconComponent } from "../ButtonIcon/ButtonIcon.component.js";
import { IconComponent } from "../Icon/Icon.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";
import { RadioIconComponent } from "../RadioIcon/RadioIcon.component.js";

export class ProfileSettingsComponent extends AComponent {
	username = new ReplayObservable();
	newUsername = "";
	password = new ReplayObservable();
	newPassword = "";
	defaultLang = "";

	onInit() {
		super.onInit();
		this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		this.createSubComponent(IconComponent.create({
			name: "profilePicture",
			parentSelector: this.getSelector(),
			icon: "defaultProfilePicture"
		}));

		this.createSubComponent(ButtonIconComponent.create({
			name: "usernameModifier",
			parentSelector: this.getSelector(),
			icon: "modifier",
			style: "btn",
			onclick: () => this.username.next(this.newUsername)
		}));
		this.createSubComponent(InputComponent.create({
			name: "usernameInput",
			parentSelector: this.getSelector(),
			inputType: "text",
			placeholder: "New Username",
			onchange: (value) => this.newUsername = value
		}));

		this.createSubComponent(ButtonIconComponent.create({
			name: "passwordModifier",
			parentSelector: this.getSelector(),
			icon: "modifier",
			style: "btn",
			onclick: () => this.password.next(this.newpassword)
		}));
		this.createSubComponent(InputComponent.create({
			name: "passwordInput",
			parentSelector: this.getSelector(),
			inputType: "password",
			placeholder: "New Password",
			autocomplete: `autocomplete="new-password"`,
			onchange: (value) => this.newPassword = value
		}));

		this.createSubComponent(ButtonIconComponent.create({
			name: "profilePictureModifier",
			parentSelector: this.getSelector(),
			icon: "modifier",
			style: "btn",
			onclick: () => console.log("picture modifier")
		}));

		this.createSubComponent(new RadioIconComponent(this.getSelector(), "langageRadio"));
		this.subComponent["langageRadio"].radioSelect.subscribe((value) => this.defaultLang = value);

		this.username.next("Username");
		this.setConfig({
			username: this.username,
			lang: this.translate("profileSettings.lang"),
		});

		return true;
	}

	generateHtml(config) {
		this.html = `
			<div id="navbar"></div>
			<div class="container">
				<div class="containerBlur">
					<div class="fs-2 fw-bold text-light m-4">
						<span>Profile Settings</span>
					</div>
					<div class="row m-3">
						<div class="fs-3 text-light text-center">
							<div id="profilePicture"></div>
							<div id="profilePictureModifier"></div>
						</div>
					</div>
					<div class="line my-4"></div>
					<div class="row m-3">
						<div>
							<div class="fs-3 text-light text-center">${config.username}</div>
							<div class="d-flex justify-content-center m-3">
								<div id="usernameInput" class="inputContainer"></div>
								<div id="usernameModifier"></div>
							</div>
						</div>
					</div>
					<div class="line my-4"></div>
					<div class="row m-3">
						<div>
							<div class="fs-3 text-light text-center">Password</div>
							<div class="d-flex justify-content-center m-3">
								<div id="passwordInput" class="inputContainer"></div>
								<div id="passwordModifier"></div>
							</div>
						</div>
					</div>
					<div class="line my-4"></div>
						<div class="row m-3">
							<div>
								<div class="fs-3 text-light text-center">${config.lang}</div>
								<div class="d-flex justify-content-center m-3">
									<div id="langageRadio"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}