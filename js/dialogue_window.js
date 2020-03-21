class DialogueWindow{
    constructor(mystery,callback){
        this.mystery = mystery;
        this.callback = callback;
        this.suspect = null;
        this.panel = "interview"

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
        //start on a different row of questions depending on how many times the suspect has been interviews
        const startRow = this.suspect.interviews % questions.length;
        //only show three questions per interview
        for(let i = 0; i < 3; i++){
            const nextQuestion = questions[startRow+i][this.suspect.answers[startRow+i]]
            const q = buildObject('div',this.questionPanel,'question-unasked')
            q.textContent = nextQuestion
            q.datar = startRow+i;
            q.addEventListener('click',(e)=>this.askQuestion(e))
        }
    }
    askQuestion = (e) => {
        console.log('asking question')
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
            console.log('the window should close')
            this.callback();
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