import { addListener } from 'process';
import { Cell, Maze } from './maze';
import { MinHeap } from './min-heap';

type CellParent = {
    cell: Cell,
    parent?: CellParent,
}

export class Solver {
    private maze: Maze;

    constructor(maze: Maze) {
        this.maze = maze;
    }

    run() {
        const frontier = new MinHeap<CellParent>();
        const explored: {
            [index: string]: ExploredNode
        } = {};

        let current: CellParent | undefined = {
            cell: this.maze.start,
        }

        let last: CellParent | undefined = undefined

        while (current !== undefined) {
            

            explored[current.cell.getLabel()] = {
                parent: current.parent?.cell,
                fScore: this.distance(current.cell, this.maze.end),
            }

            if (current.cell === this.maze.end) {
                break;
            }

            Object.values(current.cell.neighbors).forEach(neighbor => {
                const next = neighbor as Cell;

                if (explored[next.getLabel()] !== undefined) {
                    return;
                }

                const dist = this.distance(next, this.maze.end);
                const found = frontier.find(x => x.value.cell === next);

                if (found && dist < found.key) {

                    frontier.update(found.index, dist, {
                        parent: {
                            cell: neighbor as Cell,
                            parent: current,
                        },
                    });
                } else {

                    frontier.insert(dist, {
                        cell: next,
                        parent: current,
                    });
                }

            });

            last = current;
            current = frontier.pop()?.value;
        }


        last = undefined;
        const dirs = [];
        while (current !== undefined) {
            let dir;
            if (last !== undefined) {
                const dx = current.cell.x - last.cell.x;
                const dy = current.cell.y - last.cell.y;
                if (dx < 0) dir = 'east';
                if (dx > 0) dir = 'west';
                if (dy > 0) dir = 'north';
                if (dy < 0) dir = 'south';
                dirs.unshift(dir);
            }

            last = current;
            current = current.parent
        }

        return dirs;
    }

    distance(cell1: Cell, cell2: Cell): number {
        const dx = Math.abs(cell1.x - cell2.x);
        const dy = Math.abs(cell1.y - cell2.y);
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}

class ExploredNode {
    public parent?: Cell;
    public fScore?: number;
}