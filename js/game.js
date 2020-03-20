class Game{
    constructor(){
        //components
        this.renderer = new Renderer(this);
        this.dialogueManager = new DialogueWindow();
        //state variables
        // this.isPlayerPlaying = true;
        this.currentSuspect = null;
        
        //store locations that will be reused multiple times
        this.narrationContainer = document.querySelector('#narration-container');
        this.dialogueContainer = document.querySelector('#dialogue-container');
        this.nav = document.querySelector("nav");
        
        //add event listeners
        //this is a problem event listeners will need to be remove every time -- make buttons?
        document.querySelector('.close-button').addEventListener('click',this.closeDialogue)
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
        
        const startHour = Math.floor(Math.random()*13)
        this.currentHour = this.startHour + 2;
        this.case = new Case(victim,startHour);
        console.log('case',this.case)
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
        //WARNING YOU HARDCODED THIS DUMMY    
        this.locationTracker[victim.locationHistory[2].x][victim.locationHistory[2].y]['occupants'].push(victim)
        console.log(this.locationTracker)
        this.narration = "You and the inspector have been sent on another case"

        //test code
        const test_sub = Object.keys(this.suspects)[4]
        this.openDialogue(test_sub)
        this.renderer.setup(this.case,this.locationTracker, this.suspects);
        this.playText(this.narrationContainer,this.narration);
        this.test();
    }
    test = () => {
        const clues = []
        for(let s in this.suspects){
            const suspect = this.suspects[s];
            for(let i = 0; i < suspect.locationHistory.length; i++){
                const loc = suspect.locationHistory[i];
                this.locationTracker[loc.x][loc.y]['occupants'].push(suspect);
            }
            if(suspect.clue){
                const clue = suspect.clue;
                clues.push(clue)
                this.locationTracker[clue.loc.x][clue.loc.y]['clues'].push(clue);
            }
        }
        console.log('clues',clues)
        this.render();
    }
    view = (subject) => {
        console.log('iviewing: ' + subject)
        this.currentSuspect = subject;
        const currentQuestions = questions[this.suspects[subject]['interviews']];
        // console.log(currentQuestions)
        for(let i = 0; i < currentQuestions.length; i++){
            console.log(currentQuestions[i])
        }
        //temp code
        // new DialogueWindow(this.dialogueContainer,this.suspects[subject])
    }
    interview = () => {
        console.log('interviewing: ' + this.currentSuspect)
        const currentQuestions = questions[this.suspects[this.currentSuspect]['interviews']];
        // console.log(currentQuestions)
        for(let i = 0; i < currentQuestions.length; i++){
            console.log(currentQuestions[i])
        }
        this.suspects[this.currentSuspect]['interviews'] += 1;
        //temp code
        // new DialogueWindow(this.dialogueContainer,this.suspects[subject])
        this.render();
    }
    searchRoom = (room) => {
        console.log('searching room: ' + room.id)
        console.log(room.datax, room.datay)
        this.locationTracker[room.datax][room.datay]['searched'] = true;
        const clues = this.searchSuspects(room.datax,room.datay)
        if(clues.length){
            console.log('clues found', clues)
            this.locationTracker[room.datax][room.datay]['clues'] = clues;
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
    emit = (event,data) => {
        
    }
    openDialogue = (subject) => {
        this.dialogueContainer.className = "";
        const suspect = this.suspects[subject]
        this.dialogueManager.build(suspect)
    }
    closeDialogue = () => {
        this.dialogueContainer.className = "hidden";
    }
    playText = (container,text) => {
        container.textContent = text; 
    }
    setText = (container,text) => {
        container.textContent = text; 
    }
    render = () => {
        this.renderer.render(this.locationTracker,this.suspects)
    }
}