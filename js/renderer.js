class Renderer{
    constructor(game){
        this.game = game;
        this.time = 0;
        this.locationContainer = document.querySelector("#location-container");
        this.suspectContainer = document.querySelector("#suspect-container");
        this.location = null;
        this.suspects = null;
        this.locations = {};
    }
    setup = (mystery,location,suspects) => {
        //game setup
        this.mystery = mystery;
        this.buildHeader();
        this.render(location,suspects);
    }
    render = (location,suspects) => {
        //rerender location and suspects
        emptyContainer(this.locationContainer);
        emptyContainer(this.suspectContainer);
        this.location = location;
        this.suspects = suspects;
        this.buildLocation(location)
        this.buildSuspects(suspects)
    }
    buildHeader = () => {
        document.querySelector('#victim-name').textContent = "Victim: " + this.mystery.victim.name
        document.querySelector('#victim-site').textContent = this.mystery.site
    }
    buildLocation = (location) => {
        const buttonRow = buildObject('div',this.locationContainer,'row')
        for(let t = 0; t < 4; t++){
            const time = buildObject('button',buttonRow,'time-button');
            time.textContent = t === 0 ? "all" : this.mystery.startHour + t + ":00";
            time.datat = t;
            time.addEventListener('click',(e)=>this.updateTime(e))
        }

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
                        const time = location[x][y].occupants[i].locationTimes.indexOf(x+"_"+y);
                        if(this.time === 0 || this.time === time){
                            // console.log(location[x][y].occupants[i].locationHistory)
                            const footprint = buildObject("div",room,"icon-footprint");
                            footprint.style.color = location[x][y].occupants[i].color
                            //don't set the time signal for the victim
                            footprint.textContent = location[x][y].occupants[i].color === "black" ? "" : time;
                        }
                    }
                }
                if(location[x][y].clues.length){
                    for(let i = 0; i < location[x][y].clues.length; i++){
                            const clue = buildObject("div",room,"clue");
                            clue.textContent = "?"    
                        }
                }
            }
            this.locationContainer.appendChild(row)
        }
    }
    buildSuspects = (suspects) => {
        for(let x in suspects){
            const active = suspects[x]['openness'] === 0 ? false : true;
            const suspect = document.createElement("div");
            suspect.className = active ? "suspect" : "suspect inactive";
            suspect.id = suspects[x].name
            suspect.textContent = suspects[x].name;
            const bullet = document.createElement("div");
            bullet.textContent = suspects[x].interviews === 0 ? "?" : suspects[x].interviews;
            bullet.className = "bullet"
            bullet.style.backgroundColor = suspects[x].color;
            suspect.appendChild(bullet);
            this.suspectContainer.appendChild(suspect);
            if(active){
                suspect.addEventListener('click',(e)=>this.game.openDialogue(e.target.id))
            }
        }
    }
    updateTime = (e) => {
        console.log('new time',e.target.datat)
        this.time = e.target.datat;
        this.render(this.location,this.suspects);
    }
}