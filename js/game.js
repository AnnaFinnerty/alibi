class Game{
    constructor(){
        //components
        this.renderer = new Renderer(this);
        this.dialogueManager = null;
        //state variables
        // this.isPlayerPlaying = true;
        this.moves = 0;
        this.accusations = 0;
        this.currentSuspect = null;
        
        //store locations that will be reused multiple times
        this.narrationContainer = document.querySelector('#narration-container');
        this.dialogueContainer = document.querySelector('#dialogue-container');
        this.moveCounter = document.querySelector('#move-counter');
        this.nav = document.querySelector("nav");

        this.messageContainer = document.querySelector('#message-container');
        this.message = document.querySelector('#message');
        
        //add event listeners
        document.querySelector('#dialogue-close-button').addEventListener('click',this.closeDialogue)
        document.querySelector('#message-close-button').addEventListener('click',this.closeMessage)
        document.querySelector('#interview-button').addEventListener('click',this.interview)
        this.awake();
    }
    awake = () => {
        console.log('new game')
        //later we'll make a random location
        this.location = [
            ["empty","tower","empty"],
            ["bedroom","staircase","bedroom"],
            ["library","staircase","parlor"],
            ["kitchen","staircase","dining room"],
        ]
        const victim = makeCharacter(this.location);
        victim.color = "black"
        
        // const startHour = Math.floor(Math.random()*13)
        // this.currentHour = this.startHour + 2;
        this.case = buildCase(this.location,victim)
        console.log('case',this.case)

        this.dialogueManager = new DialogueWindow(this,this.case,this.closeDialogue,this.addOccupant,this.accuseSuspect);

        this.suspects = generateSuspects(this.location,this.case);
        console.log('suspects',this.suspects)
        const locationTracker = [];
        for(let x = 0; x < this.location.length; x++){
            const row = []
            for(let y = 0; y < this.location[x].length;y++){
                row.push(
                    {
                        name: this.location[x][y],
                        occupants: [],
                        clues: [],
                        searched: false
                    }
                )
            }
            locationTracker.push(row)
        }
        this.locationTracker = locationTracker;
        //add victim to the room
  
        this.locationTracker[victim.locationHistory[0][2].x][victim.locationHistory[0][2].y]['occupants'].push(victim)
        console.log('location tracker',this.locationTracker)
        this.narration = "You and the inspector have been sent on another case"

        
        this.renderer.setup(this.case,this.locationTracker, this.suspects);
        
        //run intro
        // this.openMessage([this.case.intro], 2000)

        //run test code
        // this.test();
    }
    test = () => {
        console.log('testing');
        this.testing = true;
        const clues = []
        for(let s in this.suspects){
            const suspect = this.suspects[s];
            for(let i = 0; i < suspect.locationHistory[0].length; i++){
                const loc = suspect.locationHistory[0][i];
                this.locationTracker[loc.x][loc.y]['occupants'].push(suspect);
            }
            if(suspect.clue){
                const clue = suspect.clue;
                // console.log(clue);
                clues.push(clue)
                this.locationTracker[clue.loc.x][clue.loc.y]['clues'].push(clue);
            }
        }
        // console.log('clues',clues)
        this.render();
    }
    searchForClues = (room) => {
        console.log('searching room: ' + room.id)
        // console.log(room.datax, room.datay)
        this.makeMove();
        this.locationTracker[room.datax][room.datay]['searched'] = true;
        const clues = this.searchSuspects(room.datax,room.datay)
        if(clues.length){
            console.log('clues found', clues)
            this.locationTracker[room.datax][room.datay]['clues'] = clues;
            const text = ['You found a clue!','The ' + this.locationTracker[room.datax][room.datay]['name'] + ' was hiding:' ]
            for(let i = 0; i < clues.length; i++){
                text.push(clues[i].object)
            }
            this.openMessage(text,1000)
        } else {
            this.openMessage(['Nothing found in the ' + this.locationTracker[room.datax][room.datay]['name']],1000)
        }
        this.render();
    }
    searchSuspects = (x,y) => {
        const clues = []
        for(let s in this.suspects){
            if(this.suspects[s].clue){
                if(this.suspects[s].clue.loc.x === x && this.suspects[s].clue.loc.y === y){
                    console.log('clue found!',this.suspects[s].clue.object);
                    clues.push(this.suspects[s].clue)
                }
            }
        }
        return clues
    }
    addOccupant = (x,y,suspect) => {
        console.log('occupant revealed in room!')
        this.locationTracker[x][y]['occupants'].push(suspect);
        this.render();
    }
    accuseSuspect = () => {
        this.dialogueContainer.className = "hidden";
        const suspect = this.dialogueManager.close();
        const result = suspect.accuse(this.case.victim);
        this.suspects[suspect.name] = suspect;
        this.render();
        if(result.status === 500){
            //game won
            //MTC Add in some timing here
            this.openMessage(['You accused ' + suspect.name,result.text,"YOU WIN"],1000)
            this.winGame();
        } else if (this.accusations === 2) {
            //accused too many people, no one will talk to you anymore
            this.openMessage(['You accused ' + suspect.name,result.text,"You've accused too many people","All the suspects have stopped talking to you -- you lose"],1000)
        } else if (this.accusations === 3){
            //game still playing
            if(result.status === 4){
                // you accused someone who has done something wrong
                // it's basically a freebie
                this.openMessage(['You accused ' + suspect.name,result.text,"Guess that wasn't the criminal", "Try again"],1000)
            } else {
                this.accusations++;
                this.openMessage(['You accused ' + suspect.name,result.text,"A bad mistake -- the supects have lost faith in you.", "Try again"],1000)
                
            }
        } 
    }
    winGame = () => {
        this.openMessage(["You win!"])
    }
    lostGame = () => {
        this.openMessage(["You lose!"])
    }
    makeMove = () => {
        this.moves += 1;
        this.moveCounter.textContent = "Moves: " + this.moves;
    }
    nextSuspect = () => {
        console.log('next suspect')
    }
    lastSuspect = () => {
        console.log('next suspect')
    }
    openDialogue = (subject) => {
        this.dialogueContainer.className = "";
        const suspect = this.suspects[subject];
        this.dialogueManager.build(suspect,this.testing);
        this.makeMove();
    }
    closeDialogue = () => {
        this.dialogueContainer.className = "hidden";
        const updatedSuspect = this.dialogueManager.close();
        this.suspects[updatedSuspect.name] = updatedSuspect;
        this.render();
    }
    openMessage = (textArray,time) => {
        emptyContainer(this.message);
        this.messageContainer.className = "";
        for(let i = 0; i < textArray.length; i++){
            const para = buildObject('span',this.message)
            para.textContent = textArray[i]
        }
        if(time){
            timer(this.closeMessage,time)
        }
    }
    closeMessage = () => {
        this.messageContainer.className = "hidden"
        emptyContainer(this.message);
    }
    render = () => {
        this.renderer.render(this.locationTracker,this.suspects)
    }
}