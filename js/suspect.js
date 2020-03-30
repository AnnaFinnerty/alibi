class Suspect{
    constructor(name,color,locationHistory,isHost,hasSecret,clue,local,home,profession,relation,partner){
        console.log(locationHistory)
        this.name = name;
        this.color = color;
        this.locationHistory = locationHistory;
        this.locationTimes = [];
        for(let i = 0; i < locationHistory[0].length; i++){
            this.locationTimes.push(locationHistory[0][i].x + "_" +locationHistory[0][i].y)
        }
        this.local = local;
        this.home = home;
        this.profession = profession;
        this.locationRevealed = false;
        this.isHost = isHost;
        this.hasSecret = hasSecret;
        this.clue = clue;
        this.partner = partner;
        this.relation = relation;
        this.guilty = null;
        this.openness = hasSecret ? Math.floor(Math.random()*50)+20 : Math.floor(Math.random()*60)+40;
        this.interviews = 0;
        this.questionsInInterview = [0,0,0];
        this.answers = new Array(questions.length).fill(0);
        this.notes = [];
    }
    response(questionRow){
        console.log(this.name + "  is responding")
        //find the total number of questions already answered in this interview
        const questionNum = this.questionsInInterview.reduce((a, b) => a + b, 0)
        console.log('questionNum', questionNum)
        if(questionNum === 2){
            //answering last question in round
            this.questionsInInterview[questionNum] += 1;
            const response = this.generateResponseText(questionRow,questionNum,400,200);
            return response
        } else if (questionNum === 3) {
            //answering to follow up for more questions
            //interview over. reset for next interview
            this.interviews++;
            this.questionsInInterview = [0,0,0];
            return {text:"I won't answer any more questions",status:null,question: questionNum}
        } else {
            //generate normal response
            this.questionsInInterview[questionNum] += 1;
            const response = this.generateResponseText(questionRow,questionNum,400,200);
            return response
        }
    }
    generateResponseText(questionRow,questionNum,positiveStatus,negativeStatus){
        const responseLevel = Math.floor(this.openness/10)
        const respondsAtAll = Math.random() < (this.openness/100);
        //find a row of responses from the possible rows of responses in the response dict
        //MTC WARNINGB hardcorded for now
        const responseRow = responsePaths[0][0];
        //if no response is giving, default to the obsfucation row (last row in response table)
        const text = respondsAtAll ? responses[responseRow][responseLevel] : responses[responses.length-1][responseLevel];
        return {text:text,status:respondsAtAll? positiveStatus:negativeStatus,question: questionNum}
    }
    accuse(victim){
        this.interviews += 1;
        const tod = victim.locationHistory.length - 1;
        const guiltyTest = this.hasSecret === 1;
        if(guiltyTest){
            return {text:"Zounds, you caught me!",status:500}
        } else {
            if(this.hasSecret){
                return {text:"Oh no you discovered my secret!",status:400}
            } else {
                this.openness = 0;
                return {text:"How dare you, I've done nothing wrong!",status:100}
            }
        }
    }
    addNote(note){
        this.notes.push(note)
    }
}