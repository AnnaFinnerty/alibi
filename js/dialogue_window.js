class DialogueWindow{
    constructor(mystery){
        this.suspect = null;
        this.panel = "interview"

        //store reused elements
        this.suspectProps = ['name','profession','home']
        this.displayElements = {}
        for(let i = 0; i < this.suspectProps.length; i++){
            const el = document.querySelector('#suspect-'+this.suspectProps[i]);
            this.displayElements[this.suspectProps[i]] = el
        }
        this.questionPanel = document.querySelector(".questions")
        this.responsePanel = document.querySelector(".responses")

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
        this.emptyContainer(this.questionPanel);
        this.emptyContainer(this.responsePanel);
        switch(this.panel){

            case "notes":
                this.viewNotes();
                break

            case "accuse":
                this.accuse();
                break

            default:
                this.interview();
        }
    }
    interview = () => {
        console.log('interviewing');
        emptyContainer(this.questionPanel)
        //start on a different row of questions depending on how many times the suspect has been interviews
        const startRow = this.suspect.interviews % questions.length;
        //only show three questions per interview
        for(let i = 0; i < 3; i++){
            const nextQuestion = questions[startRow+i][this.suspect.answers[startRow+i]]
            const q = buildObject('div',this.questionPanel,'question')
            q.textContent = nextQuestion
            q.datar = startRow+i;
            q.addEventListener('click',(e)=>this.askQuestion(e))
        }
    }
    askQuestion = (e) => {
        console.log('asking question')
        this.questionPanel.removeChild(e.target)
        this.responsePanel.appendChild(e.target)
        console.log('detective asks: ' + e.target.textContent)
        this.suspect.addNote(e.target.textContent);
        const text = this.suspect.response(e.target.datar)
        console.log('suspect responds ' + text)
        this.suspect.addNote(text);
        const response = buildObject('div',this.responsePanel,'response')
        response.textContent = text;
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