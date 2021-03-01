import { isUndefined } from 'util';
import { chunkArray } from './util';

export type InitSchema = {
    pony: number[],
    domokun: number[],
    'end-point': number[],
    size: number[],
    difficulty: number,
    data: ('west' | 'north')[][]
}

export class Maze {
    private cells: Cell[][];

    public width: number;
    public height: number;
    public start!: Cell;
    public end!: Cell;

    constructor(initData: InitSchema) {
        this.width = initData.size[0];
        this.height = initData.size[1];
        const wallsData = initData.data;

        const ponyIndex = initData.pony[0]
        const endPointIndex = initData['end-point'][0]
        const domokunIndex = initData.domokun[0]

        let tempCells: Cell[] = new Array(wallsData.length)
            .fill(0)
            .map(x => new Cell());

        tempCells = tempCells.map((cell: Cell, index: number) => {
            cell.x = index % this.width;
            cell.y = Math.floor(index / this.width);

            if (index === ponyIndex) {
                cell.isStart = true;
                this.start = cell;
            }

            if (index === endPointIndex) {
                cell.isEnd = true;
                this.end = cell;
            };

            // Changing other indexes like this in a map is not dangerous, because
            // we only change indexes outside of the map that has already been mapped.
            // To make sure that the pony does not go to the Domokun, we make sure that
            // it is never marked as a neighbor.
            if (index !== domokunIndex) {
                const northneighborIndex = index >= this.width ? index - this.width : undefined;
                const westneighborIndex = index % this.width ? index - 1 : undefined;

                if (northneighborIndex !== undefined && northneighborIndex !== domokunIndex && !wallsData[index].includes('north')) {
                    tempCells[index - this.width].neighbors.south = cell;
                    cell.neighbors.north = tempCells[index - this.width];
                }

                if (westneighborIndex !== undefined && westneighborIndex !== domokunIndex && !wallsData[index].includes('west')) {
                    tempCells[index - 1].neighbors.east = cell;
                    cell.neighbors.west = tempCells[index - 1];
                }

            }


            return cell;
        });

        this.cells = chunkArray(tempCells, this.width);
    }
}


type neighborsOptions = {
    north?: Cell,
    west?: Cell,
    south?: Cell,
    east?: Cell,
}

type CellOptions = {
    isStart?: boolean,
    isEnd?: boolean,
}

export class Cell {
    public neighbors: neighborsOptions;
    public isStart: boolean;
    public isEnd: boolean;
    public x!: number;
    public y!: number;

    constructor(options?: CellOptions) {
        this.isStart = options?.isStart || false;
        this.isEnd = options?.isEnd || false;
        this.neighbors = {};
    }

    getLabel(): string {
        return `${this.x},${this.y}`;
    }
}