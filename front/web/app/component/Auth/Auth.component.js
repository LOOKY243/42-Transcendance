import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { UserService } from "../../service/User.service.js";
import { ButtonIconComponent } from "../ButtonIcon/ButtonIcon.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js"

export class AuthComponent extends AComponent {
    username = "";
    password = "";

    onInit() {
        super.onInit();
        this.generateHtml({});

        this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

        this.createSubComponent(InputComponent.create({
            name: "inputLogUser",
            parentSelector: this.getSelector(),
            inputType: "text",
            placeholder: "Jean-Michel",
            onchange: (value) => this.username = value
            }));
        this.createSubComponent(InputComponent.create({
            name: "inputLogPass",
            parentSelector: this.getSelector(),
            inputType: "password",
            placeholder: "********",
            autocomplete: `autocomplete="current-password"`,
            onchange: (value) => this.password = value
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputRegUser",
            parentSelector: this.getSelector(),
            inputType: "text",
            placeholder: "Jean-Michel",
            onchange: (value) => this.username = value
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputRegPass",
            parentSelector: this.getSelector(),
            inputType: "password",
            placeholder: "********",
            autocomplete: `autocomplete="new-password"`,
            onchange: (value) => this.password = value
        }));
        this.createSubComponent(InputComponent.create({
            name: "inputRegPassConfirm",
            parentSelector: this.getSelector(),
            inputType: "password",
            placeholder: "********",
            autocomplete: `autocomplete="new-password"`
        }));

        this.createSubComponent(ButtonIconComponent.create({
            name: "registerButton",
            parentSelector: this.getSelector(),
            icon: "arrow",
            style: "btn btn-outline-success",
            onclick: () => injector[UserService].register(this.username, this.password)
        }));
        this.createSubComponent(ButtonIconComponent.create({
            name: "loginButton",
            parentSelector: this.getSelector(),
            icon: "arrow",
            style: "btn btn-outline-success",
            onclick: () => injector[UserService].login(this.username, this.password)
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
                            <form>
                                <div class="mt-4 mb-4">
                                    <p class="fs-5 text-light">${config.username}</p>
                                    <div id="inputLogUser" class="mx-2"></div>
                                </div>
                                <div class="mb-4">
                                    <p class="fs-5 text-light">${config.password}</p>
                                    <div id="inputLogPass" class="mx-2"></div>
                                </div>
                            </form>  
                            <div class="d-flex justify-content-end me-3">
                            <div id="loginButton"></div>
                            </div>
                        </div>
                    </div>
                    <div class="container col-md-4 offset-md-1 mt-5">
                        <div class="containerBlur p-3">
                            <p class="fs-3 fw-bold text-light text-center">${config.register}</p>
                            <form>
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
                            </form>
                            <div class="d-flex justify-content-end me-3">
                            <div id="registerButton"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}