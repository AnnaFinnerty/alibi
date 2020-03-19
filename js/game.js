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
        this.case = new Case(this.location,victim);
        this.suspects = generateSuspects(this.location);
        console.log('suspects',this.suspects)
        this.narration = "You and the inspector have been sent on another case"
        this.dialogue = "this is test dialogue"
        this.narrationContainer = document.querySelector('#narration-container');
        this.dialogueContainer = document.querySelector('#dialogue-container');
        this.nav = document.querySelector("nav");
        this.awake();
    }
    awake = () => {
        console.log('new game')
        this.startHour = Math.floor(Math.random()*13)
        this.renderer.buildLocation(this.location,this.suspects);
        this.playText(this.narrationContainer,this.narration);
        this.setText(this.dialogueContainer,this.dialogue);
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
        this.dialogueContainer.className = "";
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