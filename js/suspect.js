class Suspect{
    constructor(name,color,locationHistory,isHost,partner){
        this.name = name;
        this.color = color;
        this.locationHistory = locationHistory;
        this.locationRevealed = false;
        this.isHost = isHost;
        this.partner = partner;
        this.guilty = null;
        this.openness = Math.floor(Math.random()*80);
        this.guilt = Math.floor(Math.random()*80);
        this.interviews = 0;
    }
    response(){
        return "I don't know"
    }
}