function mod (n, m) {
	// always returns in the range [0, m)
	return ((n % m) + m) % m;
}

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

		var bound = this.button_click.bind(this);
		var buttons = document.querySelectorAll('footer button');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', bound);
		}

		this.body.addEventListener('keydown', this.key_down.bind(this));
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
		this.set_selected(event.target);
	},
	set_selected: function (cell) {
		if (this.selected !== null) {
			this.selected.classList.remove('selected');
		}
		this.selected = cell;
		this.selected.classList.add('selected');
	},
	button_click: function (event) {
		this.mark_selected(event.target.dataset.value);
	},
	mark_selected: function (value) {
		this.selected.dataset.value = value;
	},
	key_down: function (event) {
		var coords = [
			parseInt(this.selected.dataset.coords[0], 10),
			parseInt(this.selected.dataset.coords[1], 10)
		];
		switch (event.code) {
			case 'ArrowUp':
				this.set_selected(this.cells[mod(coords[0] - 2, this.size)][coords[1] - 1]);
				break;
			case 'ArrowDown':
				this.set_selected(this.cells[mod(coords[0], this.size)][coords[1] - 1]);
				break;
			case 'ArrowLeft':
				this.set_selected(this.cells[coords[0] - 1][mod(coords[1] - 2, this.size)]);
				break;
			case 'ArrowRight':
				this.set_selected(this.cells[coords[0] - 1][mod(coords[1], this.size)]);
				break;
			case 'KeyA':
			case 'KeyB':
			case 'KeyC':
			case 'KeyX':
				console.info(event.keyCode);
				this.mark_selected(String.fromCharCode(event.keyCode).toUpperCase());
				break;
			case 'Space':
			case 'Delete':
				this.mark_selected('');
				break;
			default:
		}

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
