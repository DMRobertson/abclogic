var ABC = {
	state: {
		size: 5
	},
	dom: {
		body: null,
		grid: null,
		cells: null,
		template: null,
		clone_grid: function () {
			return document.importNode(this.template.content, true).children[0];
		},
		init: function () {
			this.body = document.body;
			this.template = document.getElementById('grid-template');

			this.grid = this.clone_grid();
			this.grid.classList.add('main');
			this.cells = this.get_cells(this.grid);
			this.body.insertBefore(this.grid, this.body.firstChild);

			document.getElementById('toggle-help').addEventListener('click', this.toggle_help);
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
		get_cells: function (grid) {
			var cells = [];
			var rows = grid.querySelectorAll('.row');
			for (var i = 1; i < rows.length - 1; i++) {
				cells.push(this.get_row_center(rows[i]));
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
		toggle_help: function (event) {
			var list = document.body.classList;
			if (list.contains('show-help')) {
				list.remove('show-help');
				event.target.innerText = 'Help';
			} else {
				list.add('show-help');
				event.target.innerText = 'Close';
			}
		}

	}
};

function main () {
	ABC.dom.init();
	var fig = document.getElementById('example');
	var grid = ABC.dom.clone_grid();
	ABC.dom.read_edges(fig, grid);
	fig.appendChild(grid);
	ABC.dom.body.classList.remove('loading');
}

document.addEventListener('DOMContentLoaded', main);
