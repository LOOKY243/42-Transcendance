import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { Router } from "../../../spa/Router.js";
import { TranslateService } from "../../../spa/service/Translate.service.js";
import { UserService } from "../../service/User.service.js";
import { ButtonIconComponent } from "../ButtonIcon/ButtonIcon.component.js";
import { IconComponent } from "../Icon/Icon.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";
import { RadioIconComponent } from "../RadioIcon/RadioIcon.component.js";

export class ProfileSettingsComponent extends AComponent {
	username = injector[UserService].username;
	newUsername = "";
	currentPassword = "";
	newPassword = "";
	newPasswordConfirm = ""
	defaultLang = "";

	onInit() {
		if (!injector[UserService].user) {
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
			onchange: (value) => this.newUsername = value
		}));

		this.createSubComponent(ButtonIconComponent.create({
			name: "passwordModifier",
			parentSelector: this.getSelector(),
			icon: "modifier",
			style: "btn",
			onclick: () => injector[UserService].patchPassword(this.currentPassword, this.newPassword, this.newPasswordConfirm)
		}));
		this.createSubComponent(InputComponent.create({
			name: "currentPasswordInput",
			parentSelector: this.getSelector(),
			inputType: "password",
			autocomplete: `autocomplete="new-password"`,
			placeholder: "********",
			onchange: (value) => this.currentPassword = value
		}));
		this.createSubComponent(InputComponent.create({
			name: "newPasswordInput",
			parentSelector: this.getSelector(),
			inputType: "password",
			autocomplete: `autocomplete="new-password"`,
			placeholder: "********",
			onchange: (value) => this.newPassword = value
		}));
		this.createSubComponent(InputComponent.create({
			name: "newPasswordConfirmInput",
			parentSelector: this.getSelector(),
			inputType: "password",
			autocomplete: `autocomplete="new-password"`,
			placeholder: "********",
			onchange: (value) => this.newPasswordConfirm = value
		}));


		this.createSubComponent(ButtonIconComponent.create({
			name: "profilePictureModifier",
			parentSelector: this.getSelector(),
			icon: "modifier",
			style: "btn",
			onclick: () => console.log("picture modifier")
		}));

		this.createSubComponent(new RadioIconComponent(this.getSelector(), "langageRadio"));
		this.subComponent["langageRadio"].radioSelectSubscribe((value) => {
			this.defaultLang = value;
			if (value) {
				injector[TranslateService].setLang(value);
			}	
		});
		this.createSubComponent(ButtonIconComponent.create({
			name: "defaultLangModifier",
			parentSelector: this.getSelector(),
			icon: "modifier",
			style: "btn",
			onclick: () => injector[UserService].patchDefaultLang(this.defaultLang)
		}));

		this.setConfig({
			username: this.username,
			currentPassword: this.translate("profileSettings.currentPassword"),
			newPassword: this.translate("profileSettings.newPassword"),
			newPasswordConfirm: this.translate("profileSettings.newPasswordConfirm"),
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
							</div>
							<div class="text-center">
								<div id="usernameModifier"></div>
							</div>
						</div>
					</div>
					<div class="line my-4"></div>
					<div class="row m-3">
						<div>
							<form>
								<div class="fs-3 text-light text-center">${config.currentPassword}</div>
								<div class="d-flex justify-content-center m-3">
									<div id="currentPasswordInput" class="inputContainer"></div>
								</div>
								<div class="fs-3 text-light text-center">${config.newPassword}</div>
								<div class="d-flex justify-content-center m-3">
									<div id="newPasswordInput" class="inputContainer"></div>
								</div>
								<div class="fs-3 text-light text-center">${config.newPasswordConfirm}</div>
								<div class="d-flex justify-content-center m-3">
									<div id="newPasswordConfirmInput" class="inputContainer"></div>
								</div>
							</form>
							<div class="text-center">
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
								<div class="d-flex justify-content-center m-3">
									<div id="defaultLangModifier"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}