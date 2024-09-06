import { AComponent } from "../../../spa/component/AComponent.js";

export class TablesComponent extends AComponent {
	initConfig() {
		this.setConfig({
			score: this.translate("tables.score"),
			opponent: this.translate("tables.opponent"),
			date: this.translate("tables.date")
		});
	}
	
	static create(value) {
		let ret = new TablesComponent(value.parentSelector, value.name);
		return ret;
	}
	
	getCSSPath() {
		return "app/component/Tables/Tables.component.css";
	}

	generateHtml(config) {
		this.html = `
			<table class="text-light fs-5">
				<thead class="text-center">
					<tr>
						<th scope="col" class="px-3 py-1">${config.score}</th>
						<th scope="col" class="px-3 py-1">${config.opponent}</th>
						<th scope="col" class="px-3 py-1">${config.date}</th>
					</tr>
				</thead>
				<tbody class="table-group-divider text-center">
					<tr class="win">
						<td class="px-3">5 - 2</td>
						<td class="px-3">Username</td>
						<td class="px-3">06/09/2024 - 16:25</td>
					</tr>
					<tr class="loose">
						<td class="px-3">5 - 2</td>
						<td class="px-3">Username</td>
						<td class="px-3">06/09/2024 - 16:25</td>
					</tr>
				</tbody>
			</table>
		`;
	}
}