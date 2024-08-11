import { AComponent } from "../../../spa/component/AComponent.js"
import { ButtonComponent } from "../Button/Button.component.js"
import { injector } from "../../../spa/Bootstrap.js"
import { Router } from "../../../spa/Router.js"
import { InputTextComponent } from "../InputText/InputText.component.js"
import { TranslateService } from "../../../spa/service/Translate.service.js"
import { HttpClient } from "../../../spa/service/HttpClient.js"
import { TestService } from "../../service/Test.service.js"

export class HomeComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});
		
		this.createSubComponent(ButtonComponent.create({
			name: "button",
			parentSelector: this.getSelector(),
			langKey: "home.button",
			func: () => injector[Router].navigate("/user")
		}))

		this.createSubComponent(ButtonComponent.create({
			name: "langFrButton",
			parentSelector: this.getSelector(),
			langKey: "home.langFrButton",
			func: () => injector[TranslateService].setLang("fr")
		}));
		
		this.createSubComponent(ButtonComponent.create({
			name: "langEnButton",
			parentSelector: this.getSelector(),
			langKey: "home.langEnButton",
			func: () => injector[TranslateService].setLang("en")
		}));

		this.createSubComponent(ButtonComponent.create({
			name: "get",
			parentSelector: this.getSelector(),
			langKey: "get",
			func: () => injector[TestService].getValue()
		}));

		this.createSubComponent(ButtonComponent.create({
			name: "post",
			parentSelector: this.getSelector(),
			langKey: "post",
			func: () => injector[TestService].postValue("postValue")
		}));

		this.createSubComponent(new InputTextComponent(this.getSelector(), "input"));

		this.setConfig({
			inputResult: this.subComponent.input.onChange,
			homeTitle: this.translate("home.title"),
			result: injector[TestService].getResult
		});
	}

	generateHtml(config) {
		this.html = `<h1>${config.homeTitle}</h1><div id='input'></div><div id='button'></div>${config.inputResult}<div id="langFrButton"></div><div id="langEnButton"></div><div id="get"></div><div id="post"></div>${config.result}`;
	}

}