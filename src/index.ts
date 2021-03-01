import { InitSchema, Maze } from './lib/maze';
import { Solver } from './lib/solver';
import got from 'got';
import p from 'p-iteration'

const ponyUrl = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

(async function () {

    console.log('Creating Maze')
    const { body: mazeCreation } = await got.post(ponyUrl, {
        json: true,
        body: {
            'maze-width': 20,
            'maze-height': 20,
            'maze-player-name': 'Rainbow Dash',
            'difficulty': 0
        }
    })

    console.log(`Getting maze information from id ${mazeCreation.maze_id}`)
    const { body: mazeData } = await got.get(`${ponyUrl}/${mazeCreation.maze_id}`)
    const parsedData = JSON.parse(mazeData);
    const maze = new Maze(parsedData as InitSchema);

    console.log('Solving Maze')
    const solver = new Solver(maze);
    const solution = solver.run();

    if (solution.length === 0) {
        console.log('No solution to this maze.. R.I.P. Pony');
        process.exit(0);
    }

    console.log(`Solution found! ${solution.length} steps to goal!`)
    console.log(solution)

    console.log('Sending directions to pony')
    let won = false;
    await p.forEachSeries(solution, async direction => {
        try {
            const { body } = await got.post(`${ponyUrl}/${mazeCreation.maze_id}`, {
                json: true,
                body: { direction },
            })
            if (body.state === 'won') {
                won = true;
            }
        } catch (e) {
            console.log(e.body)
            process.exit(1);
        }
    })

    if (won) {
        console.log('We did it! Pony is free!')
    } else {
        console.log('Something went wrong...')
    }
})();
