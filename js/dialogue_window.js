class DialogueWindow{
    constructor(game,mystery,closeCallback,addOccupantCallback,accuseCallback){
        this.game = game;
        this.mystery = mystery;
        this.closeCallback = closeCallback;
        this.addOccupantCallback = addOccupantCallback;
        this.accuseCallback = accuseCallback;
        this.suspect = null;
        this.panel = "interview";

        //store reused elements
        this.suspectProps = ['name','profession','home','relation']
        this.displayElements = {}
        for(let i = 0; i < this.suspectProps.length; i++){
            const el = document.querySelector('#suspect-'+this.suspectProps[i]);
            this.displayElements[this.suspectProps[i]] = el
        }
        this.questionPanel = document.querySelector("#questions")
        this.responsePanel = document.querySelector("#responses")

        //event listeners
        document.querySelector('#interview-button').addEventListener('click',()=>this.updatePanel('interview'))
        document.querySelector('#notes-button').addEventListener('click',()=>this.updatePanel('notes'))
        document.querySelector('#accuse-button').addEventListener('click',this.accuseCallback)        
    }
    build = (suspect,testing) => {
        console.log('building suspect: ' + suspect)
        console.log(suspect.relation)
        this.suspect = suspect;
        for(let i in this.displayElements){
            if(suspect[i] && i != 'relation'){
                this.displayElements[i].textContent = suspect[i];
            }
        }
        if(suspect.relation){
            this.displayElements['relation'].textContent = suspect.relation.name + ", " + suspect.relation.relation;
        }
        if(testing){
            const testArea = document.querySelector('.testing');
            this.emptyContainer(testArea)
            const hasSecret = buildObject('div',testArea)
            hasSecret.textContent = suspect.hasSecret ? "I have a secret" : "I don't have a secret";
            const secretType = buildObject('div',testArea)
            let secretText = "";
            if(suspect.hasSecret === 1){
                secretText = "I am the murderer";
            } else if (suspect.hasSecret === 2 || suspect.hasSecret === 3){
                console.log(suspect.partner)
                secretText = "My secret partner is " + suspect.partner.name;
            } else if (suspect.hasSecret === 4) {
                secretText = "I have a secret but I don't have a partner"
            }
            secretType.textContent = secretText;

        }
        this.updatePanel();
    }
    updatePanel = (newPanel) => {
        this.panel = newPanel ? newPanel : this.panel;
        emptyContainer(this.questionPanel);
        emptyContainer(this.responsePanel);
        switch(this.panel){

            case "notes":
                this.questionPanel.className = "full-panel";
                this.responsePanel.className = "hidden";
                this.viewNotes();
                break

            case "accuse":
                this.questionPanel.className = "full-panel";
                this.responsePanel.className = "hidden";
                this.accuse();
                break

            default:
                this.questionPanel.className = "half-panel";
                this.responsePanel.className = "half-panel";
                this.buildInterview();
        }
    }
    buildInterview = () => {
        console.log('interviewing');
        this.questionNum = 0;
        this.startRow = this.suspect.interviews % questions.length;
        this.header = buildObject('div',this.questionPanel)
        this.header.textContent = "Interview: " + (this.suspect.interviews+1);
        //start on a different row of questions depending on how many times the suspect has been interviews
        this.interview();
    }
    interview = () => {
        console.log('interviewing')
        emptyContainer(this.questionPanel);
        this.header.textContent = "Interview: " + (this.suspect.interviews+1) + ", Question: " + (this.questionNum+1);
        //start on a different row of questions depending on how many times the suspect has been interviews
        //only show three questions per interview
        for(let i = 0; i < questions[this.startRow + this.questionNum].length; i++){
            const nextQuestion = this.parseText(questions[this.startRow + this.questionNum][i]);
            const q = buildObject('div',this.questionPanel,'question-unasked',i)
            q.textContent = nextQuestion
            // q.datax = startRow+i;
            q.addEventListener('click',(e)=>this.askQuestion(e))
        }
    }
    askQuestion = (e) => {
        console.log('asking question')
        // const questionRow = e.target.datax;
        const questionRow = e.target.id;
        this.questionPanel.removeChild(e.target)
        this.responsePanel.appendChild(e.target)
        e.target.className = 'question-asked';
        console.log('detective asks: ' + e.target.textContent)
        this.suspect.addNote(e.target.textContent);
        const suspectResponse = this.suspect.response(e.target.datar)
        console.log('suspect responds ' + suspectResponse)
        this.suspect.addNote(suspectResponse.text);
        const response = buildObject('div',this.responsePanel,'response')
        response.textContent = suspectResponse.text;
        if(suspectResponse.status === 400){
            //suspect responds with revealing information
            if(questionRow < 3){
                const revealedLoc =this.suspect.locationHistory[0][questionRow];
                this.addOccupantCallback(revealedLoc.x, revealedLoc.y,this.suspect)
            }
        }
        if(!suspectResponse.status){
            //suspect refuses to respond further. 
            ///Close the window and update suspect.
            console.log('the window should close')
            this.closeCallback();
        } else if(suspectResponse.question === 2){
            //suspect has answered all questions. follow-up?
            emptyContainer(this.questionPanel)
            const q1 = buildObject('div',this.questionPanel,'question-unasked')
            q1.textContent = "Thanks for your time"
            q1.addEventListener('click',(e)=>this.askQuestion(e))
            const q2 = buildObject('div',this.questionPanel,'question-unasked')
            q2.textContent = "Will you answer more questions?"
            q2.addEventListener('click',(e)=>this.askQuestion(e))
        } else {
            this.questionNum += 1;
            this.interview();
        }
        
    }
    parseText = (text) => {
        console.log('parsing text')
        text = text.replace(/%e|%s/gi, (str)=>{
            switch(str){
                case '%e':
                    return this.mystery.event 

                case '%s':
                    return this.mystery.startHour + ":00"

                default:
                    return 'MTC'
            }
        });
        return text
    }
    viewNotes = () => {
        console.log('viewing notes')
        const header = buildObject('div',this.questionPanel)
        header.textContent = "NOTES";
        for(let i = 0; i < this.suspect.notes.length; i++){
            const note = buildObject('div',this.questionPanel)
            note.textContent = this.suspect.notes[i]
        }
    }
    close = () => {
        return this.suspect
    }
    emptyContainer = (container) => {
        if(container.firstChild){
            while(container.firstChild){
                container.removeChild(container.firstChild)
            }
        }
    }
}