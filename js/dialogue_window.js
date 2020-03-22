class DialogueWindow{
    constructor(mystery,closeCallback,addOccupantCallback){
        this.mystery = mystery;
        this.closeCallback = closeCallback;
        this.addOccupantCallback = addOccupantCallback;
        this.suspect = null;
        this.panel = "interview";

        //store reused elements
        this.suspectProps = ['name','profession','home']
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
        document.querySelector('#accuse-button').addEventListener('click',()=>this.updatePanel('accuse'))
    }
    build = (suspect) => {
        // console.log('building suspect: ' + suspect)
        this.suspect = suspect;
        for(let i in this.displayElements){
            this.displayElements[i].textContent = suspect[i]
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
                this.interview();
        }
    }
    interview = () => {
        console.log('interviewing');
        const header = buildObject('div',this.questionPanel)
        header.textContent = "Interview: " + (this.suspect.interviews+1);
        //start on a different row of questions depending on how many times the suspect has been interviews
        const startRow = this.suspect.interviews % questions.length;
        //only show three questions per interview
        for(let i = 0; i < 3; i++){
            const nextQuestion = questions[startRow+i][this.suspect.answers[startRow+i]]
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
        if(!suspectResponse.status){
            //suspect refuses to respond further. 
            ///Close the window and update suspect.
            console.log('the window should close')
            this.closeCallback();
        } else if(suspectResponse.status === 100){
            //suspect has answered all questions. follow-up?
            const q1 = buildObject('div',this.questionPanel,'question-unasked')
            q1.textContent = "Thanks for your time"
            q1.addEventListener('click',(e)=>this.askQuestion(e))
            const q2 = buildObject('div',this.questionPanel,'question-unasked')
            q2.textContent = "Will you answer more questions?"
            q2.addEventListener('click',(e)=>this.askQuestion(e))
        } else if(suspectResponse.status === 400){
            //suspect responds with revealing information
            if(questionRow < 3){
                const revealedLoc =this.suspect.locationHistory[questionRow];
                this.addOccupantCallback(revealedLoc.x, revealedLoc.y,this.suspect)
            }
        }
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
    accuse = () => {
        console.log('j\'accuse')
        this.emptyContainer(this.questionPanel);
        const header = buildObject('div',this.questionPanel)
        header.textContent = "I accuse yoU!"
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