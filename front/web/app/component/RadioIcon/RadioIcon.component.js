import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { TranslateService } from "../../../spa/service/Translate.service.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";
import { DropButtonIconComponent } from "../DropButtonIcon/DropButtonIcon.component.js";

export class RadioIconComponent extends AComponent {
    radioSelect = new ReplayObservable();

    onInit() {
        super.onInit();
        this.generateHtml({});

        this.radioSelect.next("en");

        this.createSubComponent(DropButtonIconComponent.create({
            name: "frIcon",
            parentSelector: this.getSelector(),
            icon: "french",
            onclick: () => injector[TranslateService].setLang("fr"),

        }));
        this.createSubComponent(DropButtonIconComponent.create({
            name: "enIcon",
            parentSelector: this.getSelector(),
            icon: "english",
            onclick: () => injector[TranslateService].setLang("en")
        }));
        this.createSubComponent(DropButtonIconComponent.create({
            name: "itIcon",
            parentSelector: this.getSelector(),
            icon: "italian",
            onclick: () => injector[TranslateService].setLang("it")
        }));
    }

    render() {
        super.render();
        document.getElementsByName("langRadio").forEach(element => {
            element.addEventListener("change", () => {
                this.radioSelect.next(element.id);
            });
        });
    }

    getCSSPath() {
		return "app/component/RadioIcon/RadioIcon.component.css";
	}

    generateHtml(config) {
        this.html = `
            <div class="radioIconDiv">
                <input type="radio" class="btn-check radioIconInput" name="langRadio" id="fr" autocomplete="off">
                <label for="fr" id="frIcon" class="btn radioIconLabel"></label>

                <input type="radio" class="btn-check radioIconInput" name="langRadio" id="en" autocomplete="off" checked>
                <label for="en" id="enIcon" class="btn radioIconLabel"></label>

                <input type="radio" class="btn-check radioIconInput" name="langRadio" id="it" autocomplete="off">
                <label for="it" id="itIcon" class="btn radioIconLabel"></label>
            </div>        
        `;
    }
}