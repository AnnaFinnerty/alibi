class Case{
    constructor(victim,startHour,site,type,motive,method,intro){
        this.victim = victim;
        this.startHour = startHour;
        this.site = site;
        this.type = type;
        this.motive = motive;
        this.method = method;
        this.intro = intro;
    }
}

function buildCase(victim,startHour){
    const locationNameOne = ['Here','Gos','Dun','Abby','Bor'];
    const locationNameTwo = ['ford','mann','wyn','shire','lop'];
    const locationNameThree = ['House','Manor','Park','Castle'];
    const site = randomFromArray(locationNameOne) + randomFromArray(locationNameTwo) + " " + randomFromArray(locationNameThree);
    const type = randomFromArray(['Murder']);
    const motive = randomFromArray(['revenge','divorce','inherit','love','madness'])
    const methods = Object.keys[mysteryDict];
    const method = randomFromArray[methods];
    const intro = "This is the intro dog"
    const mystery = new Case(victim,startHour,site,type,motive,method,intro)
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



