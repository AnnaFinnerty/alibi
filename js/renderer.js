class Renderer{
    constructor(game){
        this.game = game;
        this.locationContainer = document.querySelector("#location-container");
        this.suspectContainer = document.querySelector("#suspect-container");
        this.location = null;
        this.locations = {};
    }
    setup = (mystery,location,suspects) => {
        //game setup
        this.buildHeader(mystery);
        this.render(location,suspects);
    }
    render = (location,suspects) => {
        //rerender location and suspects
        emptyContainer(this.locationContainer);
        emptyContainer(this.suspectContainer);
        this.buildLocation(location)
        this.buildSuspects(suspects)
    }
    buildHeader = (mystery) => {
        document.querySelector('#victim-name').textContent = "Victim: " + mystery.victim.name
        document.querySelector('#victim-site').textContent = mystery.site
    }
    buildLocation = (location) => {
        for(let x = 0; x < location.length; x++){
            const row = document.createElement('div');
            row.className = "row";
            for(let y = 0; y < location[x].length; y++){
                const room = document.createElement('div');
                room.className = location[x][y].name === "empty" ? "empty-room" : location[x][y].searched ? "room " + location[x][y].name : "room unsearched " + location[x][y].name;
                room.id = location[x][y];
                room.textContent = location[x][y].name === "empty" ? "" : location[x][y]['name'];
                room.datax = x;
                room.datay = y;
                row.appendChild(room);
                room.addEventListener('click',(e)=>this.game.searchRoom(e.target))
                if(location[x][y].occupants.length){
                    for(let i = 0; i < location[x][y].occupants.length; i++){
                        // console.log(location[x][y].occupants[i].locationHistory)
                        const footprint = buildObject("div",room,"footprint");
                        footprint.style.backgroundColor = location[x][y].occupants[i].color
                        //don't set the time signal for the victim
                        footprint.textContent = location[x][y].occupants[i].color === "black" ? "" : location[x][y].occupants[i].locationTimes.indexOf(x+"_"+y)
                    }
                }
                if(location[x][y].clues.length){
                    for(let i = 0; i < location[x][y].clues.length; i++){
                            const clue = buildObject("div",room,"clue");    
                        }
                }
            }
            this.locationContainer.appendChild(row)
        }
    }
    buildSuspects = (suspects) => {
        for(let x in suspects){
            const suspect = document.createElement("div");
            suspect.className = "suspect";
            suspect.id = suspects[x].name
            suspect.textContent = suspects[x].name;
            const bullet = document.createElement("div");
            bullet.textContent = suspects[x].interviews === 0 ? "?" : suspects[x].interviews;
            bullet.className = "bullet"
            bullet.style.backgroundColor = suspects[x].color;
            suspect.appendChild(bullet);
            this.suspectContainer.appendChild(suspect);
            suspect.addEventListener('click',(e)=>this.game.openDialogue(e.target.id))
        }
    }
}