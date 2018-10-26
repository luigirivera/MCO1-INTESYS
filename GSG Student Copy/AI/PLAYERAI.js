var openList = [];
var closedList = [];
var start;
var hasMoved;
var end;
var nextMove;
var next;
var grid;
var cols;
var rows;
var direct = [[0,-1],[0,1],[-1,0],[1,0]];
var path = [];
    var moveCur;
    var movePrev;
var pathFound;
var index;
// Base functions

// This function is run during the game loop repeatedly.
function THINK(player,enemies,maplayout,end)
{
    if(openList.length > 0 && !pathFound)
    {
        var lowestIndex = 0;
        for(var i = 0; i<openList.length; i++)
            if(openList[i].f < openList[lowestIndex].f)
                lowestIndex = i;
        
        var current = openList[lowestIndex];
        
        if(current.x == end.x && current.y == end.y)
        {
            var curr = current;
            while(curr.previous){
                path.push(curr);
                curr = curr.previous;
            }
            
            var tempPath = path.reverse();
            path = tempPath;
            
            pathFound = true;
        }
        
        removeFromArray(openList, current);
        closedList.push(current);
        
        var neighbors = current.neighbors;
        
        
        for(var j = 0; j<neighbors.length; j++)
        {
            var n = neighbors[j];
            if(closedList.includes(n) || n.wall)
                continue;
            else
            {
                var tempG = current.g + 1;
                var isBest = false;
                
                if(!openList.includes(n))
                {
                    isBest = true;
                    n.h = heuristic(n, end);
                    openList.push(n);
                }
                else if(tempG < n.g)
                {
                    isBest = true;
                }
                
                if(isBest)
                {
                    n.previous = current;
                    n.g = tempG;
                    n.f = n.g + n.h;
                    
                }
            }
        }
        
    }
    
    else if(pathFound)
        {
            if(index == 0 || path[index-1].x == player.getX() && path[index-1].y == player.getY())
                move(player, maplayout, end, path);
        }
        
}

// This function is called before the start of each round. Use it to initialize your
// bots intelligence!
function initAI (player,enemies,maplayout,end)
{
    pathFound = false;
	start = [player.getX(), player.getY()];
	grid = new Array(maplayout.length);
    cols = maplayout.length;
    rows = maplayout[0].length;
    hasMoved = true;
	index = 0;
    
	for(var w = 0; w <maplayout.length; w++)
		grid[w] = new Array(maplayout[w].length);
	
	for(var x = 0; x < maplayout.length; x++)
		for(var y = 0; y < maplayout[x].length; y++)
		{
			if(maplayout[x][y] == 3)
				grid[x][y] = new Spot(x, y, true);
			else
				grid[x][y] = new Spot(x, y, false);
		}
    for(var a = 0; a < maplayout.length; a++)
        for(var b = 0; b <maplayout[a].length; b++)
            grid[a][b].addNeighbors(grid);
            
	this.end = end;
	movePrev = grid[player.getX() + 1][player.getY()];
	
    openList.push(grid[player.getX()][player.getY()]);
}

function move(player, maplayout, end, path)
{
    
            moveCur = grid[player.getX()][player.getY()];
            
    next=  path[index];
    
    console.log(next);
    if (next.y < moveCur.y)
        {
            console.log(0);
            nextMove = 0;
        }
    else if(next.y > moveCur.y)
    {
            console.log(1);
            nextMove = 1;
        }
        
    else if(next.x < moveCur.x)
        {
            console.log(2);
            nextMove = 2;
        }
    else if (next.x > moveCur.x)
        {
            console.log(3);
            nextMove = 3;
        }
    
    


    switch(nextMove){ // do your decided move
        case 0: hasMoved = player.MoveUp(); break;
        case 1: hasMoved = player.MoveDown(); break;
        case 2: hasMoved = player.MoveLeft(); break;
        case 3: hasMoved = player.MoveRight(); break;
    }

    movePrev = moveCur;
        
    index++;
}

function heuristic(current, end)
{
    var d1 = Math.abs(end.x - current.x);
    var d2 = Math.abs(end.y - current.y);
    
    return d1+d2;
}

function Spot(x,y, isWall)
{
	this.x = x;
	this.y = y;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.previous = null;
	this.wall = isWall;
    this.neighbors = [];
    
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

function removeFromArray(arr, elem) {
	for(var i = arr.length - 1; i>=0; i--)
		if(arr[i] == elem)
			arr.splice(i,1);
}


function endAI(win)
{


}