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
        this.narration = "You and the inspector have been sent on another case"

        //test code
        const test_sub = Object.keys(this.suspects)[4]
        this.openDialogue(test_sub)
        this.renderer.setup(this.case,this.locationTracker, this.suspects);
        this.playText(this.narrationContainer,this.narration);
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
        console.log('searching room: ' + room)
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
        this.renderer.render(this.location,this.suspects)
    }
}