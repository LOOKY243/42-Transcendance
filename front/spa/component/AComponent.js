import { MergedObservable } from "../utils/MergedObservable.js"

export class AComponent {
	parentSelector = "";
	componentSelector = "";
	componentConfig = null;
	isInit = false;
	html = "";
	configObservable = new MergedObservable();
	
	constructor(parentSelector, componentSelector, componentConfig) {
		this.parentSelector = parentSelector;
		this.componentSelector = componentSelector;
		this.componentConfig = componentConfig;
	}

	onInit() {
		if (this.getCSSPath() && !document.querySelector(`link[href='${this.getCSSPath()}']`))
			document.querySelector("head").innerHTML += `<link href='${this.getCSSPath()}' rel='stylesheet'>`;
		this.isInit = true;
	}

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
		this.onClick();
		this.onChange();
	}

	getHtml() {
		return this.html;
	}

	getChildComponent() {
		throw new Error("getChildComponent not implemented");
	}

	getCSSPath() {}

	onClick() {
		if (this.componentConfig && this.componentConfig.onClick) {
			document.querySelector(this.getSelector()).children[0].onclick = this.componentConfig.onClick;
		}
	}

	onChange() {
		if (this.componentConfig && this.componentConfig.onChange) {		
			document.querySelector(this.getSelector()).children[0].addEventListener("change", this.componentConfig.onChange);
		}
	}

	generateHtml(config) {
		throw new Error("generateHtmnl not implemented");
	}

	setConfig(config) {
		let keys = Object.keys(config);
		keys.forEach((value) => {
			this.configObservable.mergeObservable(value, config[value]);
		});
		this.configObservable.subscribe((conf) => {
			console.log(conf);	
			Object.keys(conf).forEach((key) => {
				conf[key] = this.escapeHtml(conf[key]);
			});
			console.log("after", conf);
			this.generateHtml(conf);
			if (this.isInit)
				this.render();
		});
	}

	escapeHtml(unsafe) {
		console.log(unsafe);
		return unsafe != null ? unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;") : undefined;
	}
}
