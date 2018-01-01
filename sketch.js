/**
 *  The private key to access the
 *  amount of columns
 * 
 *  @var  int
 */
const colsKey = Symbol();

/**
 *  The private key to access the
 *  amount of rows
 * 
 *  @var  int
 */
const rowsKey = Symbol();

/**
 *  The Game of Life
 * 
 *  @author  Tycho Atsma  <tycho.atsma@gmail.com>
 *  @file    sketch.js
 */
class GameOfLife {

    /**
     *  The constructor
     * 
     *  @param  int  the amount of columns
     *  @param  int  the amount of rows
     *  @param  int  the size of an entity
     */
    constructor (cols, rows, entitySize) {
        
        /**
         *  The active grid
         * 
         *  @var  Map
         */
        this.grid = new Map();

        /**
         *  The current state of processing
         * 
         *  @var  boolean
         */
        this.state = false;

        /**
         *  The configuration
         *  
         *  @var  Map
         */
        this.config = new Map();

        /**
         *  The amount of columns
         *  
         *  @var  int
         */
        this.config.set(colsKey, cols);

        /**
         *  The amount of rows
         * 
         *  @var  int
         */
        this.config.set(rowsKey, rows);
         
        /**
         *  The size of an entity
         * 
         *  @var  int
         */
        this.config.set('resolution', entitySize);
    };

    /**
     *  Randomize the grid's data point states.
     */
    randomize () {

        // loop for the x coordinates
        for (let x = 0; x < this.config.get(colsKey); ++x) {

            // loop over the y coordinates
            for (let y = 0; y < this.config.get(rowsKey); ++y) {

                // assign a random 0 or 1
                this.grid.set((x + y * this.config.get(colsKey)), Math.round(Math.random()));
            }
        }
    };

    /**
     *  Method to count the neighbours of a data point
     *  
     *  @param   int  the x coordinate
     *  @param   int  the y coordinate
     *  @return  int
     */
    countNeighbours (x, y) {

        // the total sum of living neighbours
        let alive = 0;

        // loop over the x neighbours
        for (let i = -1; i < 2; ++i) {

            // loop over the y neighbours
            for (let j = -1; j < 2; ++j) {

                // calculate the x coordinate
                let xPos = (x + i + this.config.get(colsKey)) % this.config.get(colsKey);

                // calculate the y pos
                let yPos = (y + j + this.config.get(rowsKey)) % this.config.get(rowsKey);

                // count lives
                alive += this.grid.get((xPos + yPos * this.config.get(colsKey)));
            } 
        }

        // exclude ourselves
        alive -= this.grid.get((x + y * this.config.get(colsKey)));

        // return the sum
        return alive;
    };

    /**
     *  Evolve the current grid to the next generation
     * 
     *  @return  Map
     */
    evolve () {

        // make a new map
        let next = new Map();

        // loop over the x coordinates
        for (let x = 0; x < this.config.get(colsKey); ++x) {

            // loop over the y coordinates
            for (let y = 0; y < this.config.get(rowsKey); ++y) {

                // get the index
                let index = (x + y * this.config.get(colsKey));

                // get the old state
                let state = this.grid.get(index);

                // count the neighbours
                let neighbours = this.countNeighbours(x, y);

                 // are we dealing with a living being?
                if (state == 1 && (neighbours < 2 || neighbours > 3)) next.set(index, 0);
                
                // are we dealing with a dead being?
                else if (state == 0 && neighbours == 3) next.set(index, 1);
        
                // normal state
                else next.set(index, state);
            }
        }

        // save the new grid
        this.grid = next;

        // return the grid
        return next;
    }

    /**
     *  Draw the current grid
     */
    draw () {

        // loop over the x coordinates
        for (let x = 0; x < this.config.get(colsKey); ++x) {

            // loop over the y coordinates
            for (let y = 0; y < this.config.get(rowsKey); ++y) {

                // get the current index
                let index = (x + y * this.config.get(colsKey));

                // get the current state
                let state = this.grid.get(index);

                // do we have a living being?
                if (state === 1) {

                    // fill black
                    fill(0);

                    // get the resolution
                    let resolution = this.config.get('resolution');

                    // prepare the x coordinate
                    let xPos = (x * resolution);
                    
                    // prepare the y coordinate
                    let yPos = (y * resolution);

                    // draw a rect
                    rect(xPos, yPos, resolution, resolution);
                }
            }
        }
    }
}

/**
 *  A new game of life
 * 
 *  @var  GameOfLife
 */
let game;

/**
 *  Setup
 */
function setup() {

    // create a new canvas
    createCanvas(1000, 800);

    // determine the amount of columns
    let resolution = 10;
    let cols = (width / resolution);
    let rows = (width / resolution);

    // create a new game
    game = new GameOfLife(cols, rows, resolution);

    // randomize
    game.randomize();
}

/**
 *  Draw
 */
function draw() {

    // blank background
    background(255);

    // evolve to the next generation
    game.evolve();

    // draw a new game
    game.draw();
}