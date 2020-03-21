class Suspect{
    constructor(name,color,locationHistory,isHost,hasSecret,clue,local,home,profession,partner){
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
        this.guilty = null;
        this.openness = Math.floor(Math.random()*80);
        this.guilt = Math.floor(Math.random()*80);
        this.interviews = 0;
        this.questionsInInterview = [0,0,0];
        this.answers = new Array(questions.length).fill(0)
    }
    response(questionRow){
        console.log(this.name + "  is responding")
        //find the number of questions already answered in this interview
        const questionNum = this.questionsInInterview.reduce((a, b) => a + b, 0)
        if(questionNum >= 2){
            console.log('interview over, all questions asked in round')
            //interview over. all questions asked. reset for next interview
            this.interviews++;
            this.questionsInInterview = [0,0,0];
            return "I won't answer any more questions"
        } else {
            this.questionsInInterview[questionNum] = 1;
            return "I don't know"
        }
    }
}