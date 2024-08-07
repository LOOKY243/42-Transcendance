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
	}

	getHtml() {
		return this.html;
	}

	getChildComponent() {
		throw new Error("getChildComponent not implemented");
	}

	onClick() {
		if (this.componentConfig)
			document.querySelector(this.getSelector()).children[0].onclick = this.componentConfig.onClick;
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
			this.generateHtml(conf);
			if (this.isInit)
				this.render();
		});
	}
}
