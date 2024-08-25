import { AComponent } from "../../../spa/component/AComponent.js";
import { IconComponent } from "../Icon/Icon.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js"

export class AuthComponent extends AComponent {
    onInit() {
        super.onInit();
        this.generateHtml({});

        this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

        this.createSubComponent(IconComponent.create({
            name: "arrowIcon",
            parentSelector: this.getSelector(),
            icon : "arrow"
        }));
        this.createSubComponent(IconComponent.create({
            name: "arrowIcon2",
            parentSelector: this.getSelector(),
            icon : "arrow"
        }));

        this.createSubComponent(InputComponent.create({
            name: "inputLogUser",
            parentSelector: this.getSelector(),
            inputType: "text",
            placeholder: "Jean-Michel"
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputLogPass",
            parentSelector: this.getSelector(),
            inputType: "password",
            placeholder: "********"
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputRegUser",
            parentSelector: this.getSelector(),
            inputType: "text",
            placeholder: "Jean-Michel"
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputRegPass",
            parentSelector: this.getSelector(),
            inputType: "password",
            placeholder: "********"
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputRegPassConfirm",
            parentSelector: this.getSelector(),
            inputType: "password",
            placeholder: "********"
        }));

        this.setConfig({
            login: this.translate("auth.login"),
            register: this.translate("auth.register"),
            username: this.translate("auth.username"),
            password : this.translate("auth.password"),
            confirm : this.translate("auth.confirm")
        })
    }

    getCSSPath() {
        return "app/component/Auth/Auth.component.css"
    }

    generateHtml(config) {
        this.html = `
        <div id="navbar"></div>
            <div class="container">
                <div class="row" >
                    <div class="container col-md-4 offset-md-1 mt-5">
                        <div class="containerBlur p-3">
                            <p class="fs-3 fw-bold text-light text-center">${config.login}</p>
                            <div class="mt-4 mb-4">
                                <p class="fs-5 text-light">${config.username}</p>
                                <div id="inputLogUser" class="mx-2"></div>
                            </div>
                            <div class="mb-4">
                                <p class="fs-5 text-light">${config.password}</p>
                                <div id="inputLogPass" class="mx-2"></div>
                            </div>
                            <div class="d-flex justify-content-end me-3">
                                <button id="arrowIcon" type="button" class="btn btn-outline-success"></button>
                            </div>
                        </div>
                    </div>
                    <div class="container col-md-4 offset-md-1 mt-5">
                        <div class="containerBlur p-3">
                            <p class="fs-3 fw-bold text-light text-center">${config.register}</p>
                            <div class="mt-4 mb-4">
                                <p class="fs-5 text-light">${config.username}</p>
                                <div id="inputRegUser" class="mx-2"></div>
                            </div>
                            <div class="mb-4">
                                <p class="fs-5 text-light">${config.password}</p>
                                <div id="inputRegPass" class="mx-2"></div>
                            </div>
                            <div class="mb-4">
                                <p class="fs-5 text-light">${config.confirm}</p>
                                <div id="inputRegPassConfirm" class="mx-2"></div>
                            </div>
                            <div class="d-flex justify-content-end me-3">
                                <button id="arrowIcon2" type="button" class="btn btn-outline-success"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}