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
        this.answers = new Array(questions.length).fill(0)
    }
    response(question){
        return "I don't know"
    }
}