import { AComponent } from "../../../spa/component/AComponent.js"
import { NavBarComponent } from "../NavBar/NavBar.component.js"

export class HomeComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});
		
		// this.createSubComponent(ButtonComponent.create({
		// 	name: "button",
		// 	parentSelector: this.getSelector(),
		// 	langKey: "home.button",
		// 	func: () => injector[Router].navigate("/user")
		// }))

		// this.createSubComponent(ButtonComponent.create({
		// 	name: "langFrButton",
		// 	parentSelector: this.getSelector(),
		// 	langKey: "home.langFrButton",
		// 	func: () => injector[TranslateService].setLang("fr")
		// }));
		
		// this.createSubComponent(ButtonComponent.create({
		// 	name: "langEnButton",
		// 	parentSelector: this.getSelector(),
		// 	langKey: "home.langEnButton",
		// 	func: () => injector[TranslateService].setLang("en")
		// }));

		// this.createSubComponent(ButtonComponent.create({
		// 	name: "get",
		// 	parentSelector: this.getSelector(),
		// 	langKey: "get",
		// 	func: () => injector[TestService].getValue()
		// }));

		// this.createSubComponent(ButtonComponent.create({
		// 	name: "post",
		// 	parentSelector: this.getSelector(),
		// 	langKey: "post",
		// 	func: () => injector[TestService].postValue("postValue")
		// }));

		// this.createSubComponent(new InputTextComponent(this.getSelector(), "input"));

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		this.setConfig({
			// langFrButton: this.translate("home.langFrButton"),
			// langEnButton: this.translate("home.langEnButton"),
			// gameOne: this.translate("home.gameOne"),
			// gameTwo: this.translate("home.gameTwo"),
		});
	}

	getCSSPath() {
		return "app/component/Home/Home.component.css";
	}

	generateHtml(config) {
		this.html = `
		<div id="navbar"></div>
		<div class="d-flex align-item-center justify-content-center">
			<div class="container containerBlur py-5 my-5 row d-flex">
			</div>
		</div>`;
	}

}

// `
// 			<div class="row d-flex align-item-center justify-content-center">
// 				<div class="containerBlur m-5 row d-flex">
// 					<div class="d-flex justify-content-around">
// 						<p class="fs-1">${config.gameOne}</p>
// 						<p class="fs-1">${config.gameTwo}</p>
// 					</div>
// 					<div class="d-flex justify-content-center">
// 						<p class="fs-1">Input</p>
// 					</div>
// 					<div id="langFrButton"></div>
// 				</div>
// 			</div>`;

// this.html = `
// 			<div class="d-flex align-item-center justify-content-center">
// 				<div class="container-blur m-5">
// 					<h1>${config.homeTitle}</h1>
// 					<div id='input'></div><div id='button'></div>
// 					${config.inputResult}
// 					<div id="langFrButton"></div>
// 					<div id="langEnButton"></div>
// 					<div id="get"></div><div id="post">
// 					</div>
// 					${config.result}
// 				</div>
// 			</div>`;