var openList = [];
var closedList = [];
var nextMove;
var next;
var grid;
var cols;
var rows;
var path = [];
var moveCur;
var pathFound;
var index;
// Base functions

// This function is run during the game loop repeatedly.
// A*
function THINK(player,enemies,maplayout,end)
{
    //if there are still tiles and there is no path yet
    if(openList.length > 0 && !pathFound)
    {
        var lowestIndex = 0;
        //find the lowest cost of the list
        for(var i = 0; i<openList.length; i++)
            if(openList[i].f < openList[lowestIndex].f)
                lowestIndex = i;
        
        //hold that tile
        var current = openList[lowestIndex];
        
        //are we at the end?
        if(current.x == end.x && current.y == end.y)
        {
            //create the path
            var curr = current;
            while(curr.previous){
                path.push(curr);
                curr = curr.previous;
            }
            
            var tempPath = path.reverse();
            path = tempPath;
            
            pathFound = true;
        }
        
        //move current tile to visited tiles
        removeFromArray(openList, current);
        closedList.push(current);
        
        var neighbors = current.neighbors;
        
        //check neighbors for distances
        for(var j = 0; j<neighbors.length; j++)
        {
            var n = neighbors[j];
            //if visited or is a wall, skip
            if(closedList.includes(n) || n.wall)
                continue;
            else
            {
                var tempG = current.g + 1;
                var isBest = false;
                
                //if you havent visited it yet
                if(!openList.includes(n))
                {
                    isBest = true;
                    n.h = heuristic(n, end);
                    openList.push(n);
                }
                //if that cost is worse than what you have
                else if(tempG < n.g)
                {
                    isBest = true;
                }
                //if you found a better cost
                if(isBest)
                {
                    n.previous = current;
                    n.g = tempG;
                    n.f = n.g + n.h;
                    
                }
            }
        }
        
    }
    //if the path is made
    else if(pathFound)
        {
            //check if the player position is the same as the previous path tile
            if(index == 0 || path[index-1].x == player.getX() && path[index-1].y == player.getY())
                move(player, maplayout, end, path);
        }
        
}

// This function is called before the start of each round. Use it to initialize your
// bots intelligence!
function initAI (player,enemies,maplayout,end)
{
    pathFound = false; //is there a path already?
	grid = new Array(maplayout.length); //creating each row
    cols = maplayout.length; //column count
    rows = maplayout[0].length; //row count
	index = 0; //index for path
    
    //creating each column
	for(var w = 0; w <maplayout.length; w++)
		grid[w] = new Array(maplayout[w].length);
	
    //setting each tile
	for(var x = 0; x < maplayout.length; x++)
		for(var y = 0; y < maplayout[x].length; y++)
		{
			if(maplayout[x][y] == 3)
				grid[x][y] = new Spot(x, y, true);
			else
				grid[x][y] = new Spot(x, y, false);
		}
    
    //setting neighbors
    for(var a = 0; a < maplayout.length; a++)
        for(var b = 0; b <maplayout[a].length; b++)
            grid[a][b].addNeighbors(grid);
    
    //The start tile
    openList.push(grid[player.getX()][player.getY()]);
}

//Actually moving the bot
function move(player, maplayout, end, path)
{
    
    moveCur = grid[player.getX()][player.getY()];
            
    next=  path[index];
    
    //Figuring out the relations of 2 spots
    if (next.y < moveCur.y)
        nextMove = 0;
    else if(next.y > moveCur.y)
        nextMove = 1;
    else if(next.x < moveCur.x)
        nextMove = 2;
    else if (next.x > moveCur.x)
        nextMove = 3;
    
    switch(nextMove){ // Moving the bot
        case 0: player.MoveUp(); break;
        case 1: player.MoveDown(); break;
        case 2: player.MoveLeft(); break;
        case 3: player.MoveRight(); break;
    }

    index++;
}

//Manhattan distance
function heuristic(current, end)
{
    var d1 = Math.abs(end.x - current.x);
    var d2 = Math.abs(end.y - current.y);
    
    return d1+d2;
}

//A tile in the grid
function Spot(x,y, isWall)
{
	this.x = x;
	this.y = y;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.previous = null; //The node before for a path
	this.wall = isWall;
    this.neighbors = [];
    
    //All neighbors, even walls
    this.addNeighbors = function (grid) {
		var i = this.x;
		var j = this.y;

		if(i < cols - 1)
			this.neighbors.push(grid[i+1][j]);
		if(i > 0)
			this.neighbors.push(grid[i-1][j]);
		if(j < rows - 1)
			this.neighbors.push(grid[i][j+1]);
		if(j > 0)
			this.neighbors.push(grid[i][j-1]);
	}
}

//Removing on open list
function removeFromArray(arr, elem) {
	for(var i = arr.length - 1; i>=0; i--)
		if(arr[i] == elem)
			arr.splice(i,1);
}

//We need this for some reason
function endAI(win)
{


}