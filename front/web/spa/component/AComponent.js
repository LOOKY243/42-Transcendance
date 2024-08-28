import { TranslateService } from "../service/Translate.service.js";
import { injector } from "../Bootstrap.js";
import { MergedObservable } from "../utils/MergedObservable.js"
import { Observable } from "../utils/Observable.js";

export class AComponent {
	parentSelector = "";
	componentSelector = "";
	componentConfig = null;
	isInit = false;
	html = "";
	configObservable = new MergedObservable();
	onChange = new Observable();
	onClick = new Observable();
	subComponent = {};
	
	constructor(parentSelector, componentSelector, componentConfig) {
		this.parentSelector = parentSelector;
		this.componentSelector = componentSelector;
		this.componentConfig = componentConfig;
	}

	onInit() {
		if (this.getCSSPath() && !document.querySelector(`link[href='${this.getCSSPath()}']`))
			document.querySelector("head").innerHTML += `<link href='${this.getCSSPath()}' rel='stylesheet'>`;
		this.initConfig();
		this.isInit = true;
	}

	initConfig() {}

	getComponentSelector() {
		return this.componentSelector;
	}

	getSelector() {
		return this.parentSelector + " #" + this.getComponentSelector();
	}

	render() {
		document.querySelector(this.getSelector()).innerHTML = this.getHtml();
		this.getChildComponent().forEach((value) => {
			if (!value.isInit)
				value.onInit();
			value.render();
		});
		document.querySelector(this.getSelector()).children[0].onclick = () => this.onClick.next({});
		document.querySelector(this.getSelector()).children[0].addEventListener("change", (event) => {
			this.onChange.next(event.target.value);
		});
	}

	createSubComponent(aComponent) {
		this.subComponent[aComponent.getComponentSelector()] = aComponent;
	}

	getHtml() {
		return this.html;
	}

	getChildComponent() {
		return Object.values(this.subComponent);
	}

	getCSSPath() {}

	generateHtml(config) {
		throw new Error("generateHtmnl not implemented");
	}

	setConfig(config) {
		let keys = Object.keys(config);
		keys.forEach((value) => {
			let obs = config[value];
			if (obs.translate) {
				obs = injector[TranslateService].translate(obs.value, true);
			}
			this.configObservable.mergeObservable(value, obs);
		});
		this.configObservable.subscribe((conf) => {
			Object.keys(conf).forEach((key) => {
				conf[key] = this.escapeHtml(conf[key]);
			});
			this.generateHtml(conf);
			if (this.isInit)
				this.render();
		});
	}

	escapeHtml(unsafe) {
		if (typeof unsafe !== "string") {
			return unsafe
		}
		const map = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#39;"
		};
		return unsafe != null ? unsafe.replace(/[&<>"']/g, (match) => map[match]) : undefined;
	}

	translate(key) {
		return injector[TranslateService].translate(key);
	}

}
