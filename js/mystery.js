class Mystery{
    constructor(location,victim,startHour,event,site,type,motive,method,intro){
        this.location = location;
        this.victim = victim;
        this.startHour = startHour;
        this.totalHours = 3;
        this.event = event;
        this.site = site;
        this.crime = type;
        this.motive = motive;
        this.motiveKnown = false;
        this.method = method;
        this.methodKnown = true;
        this.tod = null;
        this.intro = intro;
        this.solved = false;
    }
}

function buildCase(location,victim){
    const startHour = Math.floor(Math.random()*13);
    const eventTier = startHour < 5 ? 0 : startHour < 10 ? 1: 2;
    const events = [
        ['lunch','tea','supper','tennis'],
        ['dinner','the ball','the party'],
        ['hunting party','long weekend','cocktails']
    ]
    const event = randomFromArray(events[eventTier])
    const locationNameOne = ['Here','Gos','Dun','Abby','Bor'];
    const locationNameTwo = ['ford','mann','wyn','shire','lop'];
    const locationNameThree = ['House','Manor','Park','Castle'];
    const site = randomFromArray(locationNameOne) + randomFromArray(locationNameTwo) + " " + randomFromArray(locationNameThree);
    const type = randomFromArray(['murder']);
    const motive = randomFromArray(['revenge','divorce','inherit','love','madness'])
    const crime = randomFromArray(mysteryDict[type]);
    const mystery = new Mystery(location,victim,startHour,event,site,type,motive,crime.method)
    const intro = buildIntro(mystery)
    mystery.intro = intro;
    return mystery
}

const mysteryDict = {
    murder: [
        {
            method: 'poison',
            adjective: 'poisoned',
            weapons: ['cyanide']
        }
    ]
}

const motiveDict = {

}

function buildIntro(mystery){
    const victim = mystery.victim.name;
    const site = mystery.site;
    const intros = [
        "You have been summoned to " + site + ". " + victim + " has been found murdered! Can you figure out who did it?"
    ]
    return randomFromArray(intros)
}



