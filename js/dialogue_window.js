class DialogueWindow{
    constructor(game,mystery,closeCallback,addOccupantCallback,accuseCallback,searchRoomAtTimeCallback){
        this.game = game;
        this.mystery = mystery;
        this.closeCallback = closeCallback;
        this.addOccupantCallback = addOccupantCallback;
        this.accuseCallback = accuseCallback;
        this.searchRoomAtTimeCallback = searchRoomAtTimeCallback;
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
        this.timeTable = document.querySelector("#time-table")
        //build entries for time table
        for(let i = 0; i < this.mystery.totalHours; i++){
            const row = buildObject('div',this.timeTable,"row");
            const timeLabel = buildObject('span',row, "time-label");
            timeLabel.textContent = (this.mystery.startHour + i) + ":00";
            //these should all be dropdowns
            const timeEntry = buildObject('span',row, "time-entry","time-entry-"+i);
            timeEntry.textContent = "?";
        }

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
        //just stuff to make testing easier
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
        console.log('building interview');
        this.questionNum = 0;
        // this.startRow = this.suspect.interviews % questions.length;\
        this.startRow = this.suspect.interviews * 3;
        console.log('start row',this.startRow);
        //start on a different row of questions depending on how many times the suspect has been interviews
        this.interview();
    }
    interview = () => {
        console.log('interviewing ' + this.suspect.name + ". Interview:" + this.suspect.interviews)
        emptyContainer(this.questionPanel);
        this.header = buildObject('div',this.questionPanel)
        this.header.textContent = "Interview: " + (this.suspect.interviews+1) + ", Question: " + (this.questionNum+1);
        //start on a different row of questions depending on how many times the suspect has been interviews
        //only show three questions per interview
        for(let i = 0; i < questions[this.startRow + this.questionNum].length; i++){
            //run questions through text parser, which will dynamically add
            //this cases' information to the questions
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
        // this.questionPanel.removeChild(e.target)
        //append asked question to response panel, change class name and add to suspect's notes
        this.responsePanel.appendChild(e.target)
        e.target.className = 'question-asked';
        this.suspect.addNote(e.target.textContent);
        //generate suspects response based on current question number
        const suspectResponse = this.suspect.response(e.target.datar)
        const suspectResponseParsed = this.parseText(suspectResponse.text)
        this.suspect.addNote(suspectResponseParsed);
        const response = buildObject('div',this.responsePanel,'response')
        response.textContent = suspectResponseParsed;
        //suspect responds with revealing information -- a lie or the truth
        if(suspectResponse.status === 400 || suspectResponse.status === 500){
            
            if(this.questionNum < 3){
                const revealedLoc =this.suspect.locationHistory[0][this.questionNum];
                document.querySelector("#time-entry-"+this.questionNum).textContent = revealedLoc['name'];
                this.addOccupantCallback(revealedLoc.x, revealedLoc.y,this.suspect);
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
    parseText = (text,status) => {
        text = text.replace(/%e|%s|%l|%t|%v/gi, (str)=>{
            switch(str){
                case '%e':
                    return this.mystery.event 

                case '%s':
                    return this.mystery.startHour + ":00"

                case '%t':
                    return (this.mystery.startHour + this.questionNum)+ ":00"

                case '%l':
                    return status === 400 ? this.suspect.locationHistory[1][this.questionNum]['name'] : this.suspect.locationHistory[0][this.questionNum]['name']

                case '%v':
                    return this.mystery.victim.name
                
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