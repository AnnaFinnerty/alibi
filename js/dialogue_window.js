class DialogueWindow{
    constructor(mystery){
        this.suspect = null;
        this.panel = "interview"
        this.suspectProps = ['name','profession','home']
        this.displayElements = {}
        for(let i = 0; i < this.suspectProps.length; i++){
            const el = document.querySelector('#suspect-'+this.suspectProps[i]);
            this.displayElements[this.suspectProps[i]] = el
        }
        this.questionPanel = document.querySelector(".questions")
    }
    build = (suspect) => {
        // console.log('building suspect: ' + suspect)
        this.suspect = suspect;
        for(let i in this.displayElements){
            this.displayElements[i].textContent = suspect[i]
        }
        this.updatePanel();
    }
    updatePanel = () => {
        switch(this.panel){

            default:
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
            const q = buildObject('div',this.questionPanel,'question')
            q.textContent = nextQuestion
            q.datai = i;
            q.addEventListener('click',this.askQuestion)
        }
    }
    askQuestion = (i,j) => {
        console.log('asking question')
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