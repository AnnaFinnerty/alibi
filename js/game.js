class Game{
    constructor(){
        this.renderer = new Renderer(this);
        this.isPlayerPlaying = true;
        this.location = [
            ["empty","tower","empty"],
            ["bedroom","staircase","bedroom"],
            ["library","staircase","parlor"],
            ["kitchen","staircase","dining room"],
        ]
        const victim = makeCharacter(this.location);
        this.case = new Case(victim);
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
        this.narrationContainer = document.querySelector('#narration-container');
        this.dialogueContainer = document.querySelector('#dialogue-container');
        this.nav = document.querySelector("nav");
        this.awake();
    }
    awake = () => {
        console.log('new game')
        //test code
        const test_sub = Object.keys(this.suspects)[4]
        new DialogueWindow(this.dialogueContainer,this.suspects[test_sub])
        this.startHour = Math.floor(Math.random()*13)
        this.currentHour = this.startHour + 2;
        this.renderer.buildLocation(this.locationTracker, this.suspects,this.case,this.startHour);
        this.playText(this.narrationContainer,this.narration);
    }
    interview = (subject) => {
        console.log('interviewing: ' + subject)
        const currentQuestions = questions[this.suspects[subject]['interviews']];
        // console.log(currentQuestions)
        for(let i = 0; i < currentQuestions.length; i++){
            console.log(currentQuestions[i])
        }
        this.suspects[subject]['interviews'] += 1;
        //temp code
        new DialogueWindow(this.dialogueContainer,this.suspects[subject])
        this.render();
    }
    searchRoom = (room) => {
        console.log('searching room: ' + room)
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