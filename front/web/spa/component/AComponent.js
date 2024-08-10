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

	getHtml() {
		return this.html;
	}

	getChildComponent() {
		throw new Error("getChildComponent not implemented");
	}

	getCSSPath() {}

	generateHtml(config) {
		throw new Error("generateHtmnl not implemented");
	}

	setConfig(config) {
		let keys = Object.keys(config);
		keys.forEach((value) => {
			this.configObservable.mergeObservable(value, config[value]);
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
		return unsafe != null ? unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;") : undefined;
	}
}
