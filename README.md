# Save The Pony

[A*](https://en.wikipedia.org/wiki/A*_search_algorithm) implementation to solve a maze.
It uses a Min Heap to keep track of what cell of the maze to search next.
It uses a 2D array while constructing the maze, but after the maze is constructed, it really only uses the linked list representation to traverse the cells.

### Optimizations
The G score of the A* algorithm is always `1` in this case since all cells are equally distances from their neighbors, which is not really helpful.
One optimization we could make could be to remove redundant cells inbetween connections that only travel in a stright line, and therefore does not present a choice for the algoritm, as seen here.
![Maze-opts.png](http://enslev.dk/maze-opts.png)

This would make the G score relevant and also reduce the size of the tree that the algorithm needs to navigate.