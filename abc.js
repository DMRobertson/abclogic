function ABC () {
	this.size = 5;
	this.selected = null;

	this.get_dom_references();
	this.add_event_listeners();
}

ABC.prototype = {
	// setup
	get_dom_references: function () {
		this.body = document.body;
		this.template = document.getElementById('grid-template');

		this.grid = this.clone_grid();
		this.grid.classList.add('main');
		this.body.insertBefore(this.grid, this.body.firstChild);

		this.cells = this.get_cells(this.grid);
	},
	add_event_listeners: function () {
		var bound = this.cell_click.bind(this);
		for (var i = 0; i < this.cells.length; i++) {
			for (var j = 0; j < this.cells.length; j++) {
				this.cells[i][j].addEventListener('click', bound);
			}
		}

		document.getElementById('toggle-help')
			.addEventListener('click', this.toggle_help.bind(this));
	},

	// utilities
	clone_grid: function () {
		return document.importNode(this.template.content, true).children[0];
	},
	get_cells: function (grid) {
		var cells = [];
		var rows = grid.querySelectorAll('.row');
		for (var i = 1; i < rows.length - 1; i++) {
			cells.push(this.get_row_center(rows[i]));
		}
		return cells;
	},
	get_row_center: function (row) {
		var cells = row.querySelectorAll('.cell');
		cells = Array.prototype.slice.call(cells);
		cells.pop();
		cells.shift();
		return cells;
	},
	get_col_center: function (grid, index) {
		var cells = [];
		for (var i = 1; i < grid.childElementCount - 1; i++) {
			cells.push(grid.children[i].children[index]);
		}
		return cells;
	},
	get_edges: function (grid) {
		var rows = grid.querySelectorAll('.row');
		var top = this.get_row_center(rows[0]);
		var bottom = this.get_row_center(rows[rows.length - 1]);
		var left = this.get_col_center(grid, 0);
		var right = this.get_col_center(grid, rows.length - 1);
		return [top, right, bottom, left];
	},
	read_edges: function (info, grid) {
		var edges = this.get_edges(grid);
		this.assign_edge(info.dataset.top, edges[0]);
		this.assign_edge(info.dataset.right, edges[1]);
		this.assign_edge(info.dataset.bottom, edges[2]);
		this.assign_edge(info.dataset.left, edges[3]);
	},
	assign_edge: function (chars, cells) {
		for (var i = 0; i < cells.length; i++) {
			var char = chars.charAt(i);
			if (char !== ' ') {
				cells[i].dataset.value = char;
			}
		}
	},
	// event listeners
	toggle_help: function (event) {
		var list = this.body.classList;
		if (list.contains('show-help')) {
			list.remove('show-help');
			event.target.innerText = 'Help';
		} else {
			list.add('show-help');
			event.target.innerText = 'Close';
		}
	},
	cell_click: function (event) {
		if (event.button !== 0) {
			return;
		}
		if (this.selected !== null) {
			this.selected.classList.remove('selected');
		}
		this.selected = event.target;
		this.selected.classList.add('selected');
	}
};

function main () {
	var abc = new ABC();
	var fig = document.getElementById('example');
	var grid = abc.clone_grid();
	abc.read_edges(fig, grid);
	fig.appendChild(grid);
	abc.body.classList.remove('loading');
}

document.addEventListener('DOMContentLoaded', main);
