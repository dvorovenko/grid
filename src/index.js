class Grid {

	constructor() {
		this.ww = window.innerWidth;
		this.wh = window.innerHeight;
		this.timeout = false;
    this.defaultColor = '#f00';

    this.canvasID = 'grid';
		this.columnsInpupId = 'grid_columns';
		this.gutterInputId = 'grid_gutter';
		this.opacityInputId = 'grid_opacity';
    this.containerId = 'grid_widget';
    this.buttonId = 'draw_button';
		this.baselineInputId = 'grid_baseline';
		this.baselineCheckboxId = 'grid_baseline_checkbox';

		this.init();
	}

	init() {
    this.baselineTrigger();
    this.getWidgetValues();
  }

  showGrid(...data) {
    if(!document.getElementById(this.canvasID)) {
      this.generateCanvas();
    } else {
      this.cleanCanvas();
    }
    this.draw(...data);
  }

  generateCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', this.canvasID);
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  draw(columns, gutter, opacity, color, clearance) {
    this.setCanvasStyles(opacity, color);
    this.drawColumns(columns, gutter);
    this.drawRows(clearance);
    this.resize();
  }

	setCanvasStyles(opacity, color) {
		this.canvasOpacity = Number(opacity) || 0.6;
		this.fillColor = color || this.defaultColor;
		this.canvas.setAttribute('width', this.ww);
		this.canvas.setAttribute('height', this.wh);
		this.ctx.globalAlpha = this.canvasOpacity;
		this.ctx.fillStyle = this.fillColor;
	}

	drawColumns(columns, gutter) {
		this.columns = Number(columns) || 12;
		this.gutter = Number(gutter) || 0;
		this.calculateColumnWidth(this.columns, this.gutter);
		if (gutter > 0) {
			for (let i = 0; i <= this.columns - 1; i++) {
				this.drawColumn((this.columnWidth + this.gutter) * i);
			}
		} else {
			for (let i = 0; i <= columns; i++) {
				if (this.isOdd(i)) {
					this.drawColumn(this.columnWidth * i - this.columnWidth);
				}
			}
		}
	}
	drawRows(clearance) {
		this.clearance = Number(clearance) || 5;
		this.rowsNumber = this.canvas.height / this.clearance;
		for (let i = 0; i <= this.rowsNumber; i++) {
			this.drawLine(i * this.clearance);
		}
	}
	drawColumn(shift) {
		this.ctx.fillRect(shift, 0, this.columnWidth, this.canvas.height);
	}
	drawLine(shift) {
		this.ctx.strokeStyle = this.defaultColor;
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.moveTo(0, shift);
		this.ctx.lineTo(this.canvas.width, shift);
		this.ctx.stroke();
	}
	calculateColumnWidth(number, gutterWidth) {
		let guttersWidth = gutterWidth * (number - 1);
		this.columnWidth = Math.ceil((this.canvas.width - guttersWidth) / number);
	}
	isOdd(number) {
		return number % 2;
	}
	resize() {
		window.addEventListener('resize', () => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.ww = window.innerWidth;
				this.wh = window.innerHeight;
				this.setCanvasStyles(this.canvasOpacity, this.gutter);
				this.drawColumns(this.columns, this.gutter);
				this.drawRows(this.clearance);
			}, 300);
		});
	}
	getWidgetValues() {
		const columnsInput = document.getElementById(this.columnsInpupId);
		const gutterInput = document.getElementById(this.gutterInputId);
		const opacityInput = document.getElementById(this.opacityInputId);
		const baselineInput = document.getElementById(this.baselineInputId);
    const button = document.getElementById(this.buttonId);
    button.addEventListener('click', () => {
      this.showGrid(columnsInput.value, gutterInput.value, opacityInput.value, '#f00', baselineInput.value);
    });
	}

  cleanCanvas() {
    this.ctx.clearRect(0, 0, this.ww, this.wh);
  }

	baselineTrigger() {
		document.getElementById(this.baselineCheckboxId).onclick = () => {
			document.getElementById(this.containerId).classList.toggle('with_gutter');
		};
	}
}

window.onload = function () {
  new Grid();
};