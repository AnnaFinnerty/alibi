class Suspect{
    constructor(name,color,locationHistory,isHost,hasSecret,clue,local,home,profession,relation,partner){
        console.log(locationHistory)
        this.name = name;
        this.color = color;
        this.locationHistory = locationHistory;
        this.locationTimes = [];
        for(let i = 0; i < locationHistory.length; i++){
            this.locationTimes.push(locationHistory[i].x + "_" +locationHistory[i].y)
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
        //find the number of questions already answered in this interview
        const questionNum = this.questionsInInterview.reduce((a, b) => a + b, 0)
        console.log('questionNum', questionNum)
        if(questionNum === 2){
            //answering last question in round
            this.questionsInInterview[questionNum] += 1;
            const responds = Math.random() > .5 && this.openness > 30
            const text = responds ? "I'm happy to tell you" : "I don't know";
            const status = responds ? 400 : 200;
            return {text:text,status:status,question: questionNum}
        } else if (questionNum === 3) {
            //answering to follow up for more questions
            //interview over. reset for next interview
            this.interviews++;
            this.questionsInInterview = [0,0,0];
            return {text:"I won't answer any more questions",status:null,question: questionNum}
        } else {
            this.questionsInInterview[questionNum] += 1;
            const responds = Math.random() > .5 && this.openness > 30
            const text = responds ? "I'm happy to tell you" : "I don't know";
            const status = responds ? 400 : 200;
            return {text:text,status:status,question: questionNum}
        }
    }
    accuse(victimLocation){
        this.interviews += 1;
        if(this.hasSecret){
            return "Oh no you discovered my secret"
        } else {
            this.openness = 0;
            return "How dare you! I can't believe you accused me!"
        }
    }
    addNote(note){
        this.notes.push(note)
    }
}