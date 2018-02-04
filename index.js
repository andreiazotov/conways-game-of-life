(function() {
	//sss
    function Universe(canvasId) {
        var FPS = 15;
        var SEC = 1000;
        this.canvas = document.getElementById(canvasId);
        this.universe = this.canvas.getContext("2d");
        this.size = {
            width: this.universe.canvas.width,
            height: this.universe.canvas.height,
        };
        this.cellSize = {
            width: 4,
            height: 4
        };
        this.generation = [];
        this.init(this.cellSize.width, this.cellSize.height);
        var self = this;
        function tick() {
            setTimeout(function() {
                self.update(self.cellSize.width, self.cellSize.width);
                self.draw();
                requestAnimationFrame(tick);
            }, SEC / FPS);
        }
        tick();
    }

    Universe.prototype.init = function(cellWidth, cellHeight) {
        for (var y = 0; y < this.size.height; y += cellHeight) {
            for (var x = 0; x < this.size.width; x += cellWidth) {
                var status = (Math.floor(Math.random() * 10) === 8);
                this.generation.push(new Cell(cellWidth, cellHeight, x, y, status));
            }
        }
    };

    Universe.prototype.update = function(cellWidth, cellHeight) {
        var newGeneration = [];
        for (var y = 0; y < this.size.height / cellHeight; y++) {
            for (var x = 0; x < this.size.width / cellWidth; x++) {
                var cell = this.size.width / cellWidth * y + x,
                    dx = [0, 0, -1, 1, 1, 1, -1, -1],
                    dy = [1, -1, 0, 0, 1, -1, 1, -1],
                    neighbours = 0;
                for (var k = 0; k < 8; k++) {
                    var nearby = this.size.width / cellWidth * (y + dy[k]) + (x + dx[k]);
                    if (y + dy[k] >= 0 && x + dx[k] >= 0 && nearby < this.generation.length && this.generation[nearby].alive) {
                      neighbours++;
                    }
                }
                if (!this.generation[cell].alive && neighbours === 3) {
                    newGeneration.push(new Cell(cellWidth, cellHeight, x * cellWidth, y * cellHeight, true));
                } else if (this.generation[cell].alive && (neighbours > 3 || neighbours < 2)) {
                    newGeneration.push(new Cell(cellWidth, cellHeight, x * cellWidth, y * cellHeight, false));
                } else {
                    newGeneration.push(new Cell(cellWidth, cellHeight, x * cellWidth, y * cellHeight, this.generation[cell].alive));
                }
            }
        }
        this.generation = newGeneration;
    };

    Universe.prototype.draw = function () {
        this.universe.clearRect(0, 0, this.size.width, this.size.height);
        this.generation.forEach(function(cell) {
          if (cell.alive) {
              this.universe.fillRect(cell.position.x, cell.position.y, cell.size.width, cell.size.height);
          }
        }, this);
    };

    function Cell(width, height, posX, posY, status) {
        this.size = {
            width: width,
            height: height
        };
        this.position = {
            x: posX,
            y: posY
        };
        this.alive = status;
    }

    window.onload = function() { new Universe("universe"); };

})();
