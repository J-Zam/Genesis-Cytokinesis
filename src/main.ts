import "./style.scss";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const btnStart = document.getElementById("btn__start") as HTMLElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let sizeWidth = canvas.width;
let sizeHeigth = canvas.height;
let resolution = 10;
let colors = ["#77dd77", "#84b6f4"];
let colorsIndex = Math.floor(Math.random() * colors.length);

class Cytokinesis {
    sizeWidth: number;
    sizeHeigth: number;
    ctx: CanvasRenderingContext2D;
    cells: boolean[][];

    constructor(
        sizeWidth: number,
        sizeHeigth: number,
        ctx: CanvasRenderingContext2D
    ) {
        this.sizeWidth = sizeWidth / resolution;
        this.sizeHeigth = sizeHeigth / resolution;
        this.ctx = ctx;
        this.cells = [];
    }

    create() {
        for (let x = 0; x < this.sizeWidth; x++) {
            let row = [];
            for (let y = 0; y < this.sizeHeigth; y++) {
                let isAlive = Math.random() < 0.5;
                row.push(isAlive);
            }
            this.cells.push(row);
        }
    }

    draw() {
        this.ctx.fillStyle = "rgb(0,0,0, 0.02)";
        this.ctx.fillRect(0, 0, this.sizeWidth, this.sizeHeigth);
        for (let x = 0; x < this.sizeWidth; x++) {
            for (let y = 0; y < this.sizeHeigth; y++) {
                let color = "";
                this.cells[x][y] ? (color = colors[colorsIndex]) : (color = "black");
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(x * resolution, y * resolution, resolution / 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    evaluate() {
        let cellsTmp: boolean[][] = new Array(sizeWidth)
            .fill("")
            .map(() => new Array(sizeHeigth).fill(false));

        for (let x = 0; x < this.sizeWidth; x++) {
            for (let y = 0; y < this.sizeHeigth; y++) {
                let aliveCells = 0;

                // Case #1
                if (x > 0 && y > 0)
                    if (this.cells[x - 1][x - 1]) aliveCells++;

                // Case #2
                if (y > 0)
                    if (this.cells[x][y - 1]) aliveCells++;

                // Case #3
                if (x < this.sizeWidth - 1 && y > 0)
                    if (this.cells[x + 1][y - 1]) aliveCells++;

                // Case #4
                if (x > 0)
                    if (this.cells[x - 1][y]) aliveCells++;

                // Case #5
                if (x < this.sizeWidth - 1)
                    if (this.cells[x + 1][y]) aliveCells++;

                // Case #6
                if (x > 0 && y < this.sizeWidth - 1)
                    if (this.cells[x - 1][y + 1]) aliveCells++;

                // Case #7
                if (y < this.sizeWidth - 1)
                    if (this.cells[x][y + 1]) aliveCells++;

                // Case #8
                if (x < this.sizeWidth - 1 && y < this.sizeWidth - 1)
                    if (this.cells[x + 1][y + 1]) aliveCells++;

                if (this.cells[x][y])
                    cellsTmp[x][y] = aliveCells === 2 || aliveCells === 3;
                else cellsTmp[x][y] = aliveCells === 3;
            }
        }

        this.cells = cellsTmp;
    }

    next() {
        this.draw();
        this.evaluate();
    }
}

const automata = new Cytokinesis(sizeWidth, sizeHeigth, ctx);
automata.create();
automata.draw();

btnStart.addEventListener("click", async () => {
    if (!btnStart.textContent!.includes("Start")) {
        window.location.reload();
        return;
    };

    btnStart.innerText = "Restart";
    setInterval(() => automata.next(), 200);
});
