var ABC = {
	state: {
		size: null
	},
	dom: {
		body: null,
		main: null,
		cells: null,
		init: function () {
			this.body = document.body;
			this.main = document.getElementsByTagName('main')[0];
		}
	},

	generate_grid: function (size) {
		this.dom.cells = [];
		for (var i = 0; i <= size + 1; i++) {
			var row = document.createElement('div');
			row.classList.add('row');
			row.id = 'row' + i.toString();
			this.dom.main.appendChild(row);
			for (var j = 0; j <= size + 1; j++) {
				var cell = document.createElement('div');
				cell.classList.add('cell');
				if (i === 0 || i === size + 1 || j === 0 || j === size + 1) {
					cell.classList.add('edge');
				} else {
					cell.classList.add('grid');
				}

				cell.id = 'cell' + i.toString() + j.toString();
				row.appendChild(cell);
				this.dom.cells.push(cell);
			}
		}
	}
};

function main () {
	document.body.classList.remove('loading');
	ABC.dom.init();
	ABC.generate_grid(5);
}

document.addEventListener('DOMContentLoaded', main);
