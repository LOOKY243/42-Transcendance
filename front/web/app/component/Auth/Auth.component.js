import { AComponent } from "../../../spa/component/AComponent.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js"

export class AuthComponent extends AComponent {
    onInit() {
        super.onInit();
        this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));
    }

    getCSSPath() {
        return "app/component/Auth/Auth.component.css"
    }

    generateHtml(config) {
        this.html = `
        <div id="navbar"></div>
        <div class="d-flex justify-content-center" >
            <div class="container containerBlur p-4 m-5">
                <p class="fs-3 fw-bold text-light text-center">Log in</p>
                <div class="mt-4 mb-4">
                    <p class="fs-5 text-light">Username</p>
                    <input type="text" class="form-control authInput mt-2 my-3" placeholder="Jean-Michel">
                </div>
                <div class="mb-4">
                    <p class="fs-5 text-light">Password</p>
                    <input type="text" class="form-control authInput mt-2 my-3" placeholder="*******">
                </div>
                <div class="d-flex justify-content-end me-3">
                    <button type="button" class="btn btn-outline-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="container containerBlur p-4 m-5">
                <p class="fs-3 fw-bold text-light text-center">Register</p>
                <div class="mt-4 mb-4">
                    <p class="fs-5 text-light">Username</p>
                    <input type="text" class="form-control authInput mt-2 my-3" placeholder="Jean-Michel">
                </div>
                <div class="mb-4">
                    <p class="fs-5 text-light">Password</p>
                    <input type="text" class="form-control authInput mt-2 my-3" placeholder="*******">
                </div>
                <div class="mb-4">
                    <p class="fs-5 text-light">Confirm</p>
                    <input type="text" class="form-control authInput mt-2 my-3" placeholder="*******">
                </div>
                <div class="d-flex justify-content-end me-3">
                    <button type="button" class="btn btn-outline-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }
}