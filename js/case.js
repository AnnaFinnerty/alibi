class Case{
    constructor(victim,startHour){
        this.victim = victim;
        this.startHour = startHour;
        const locationNameOne = ['Here','Gos','Dun','Abby','Bor'];
        const locationNameTwo = ['ford','mann','wyn','shire','lop'];
        const locationNameThree = ['House','Manor','Park','Castle'];
        const type = randomFromArray(['Murder']);
        //for the future...
        // const type = randomFromArray(['Murder','Theft','Kidnapping']);
        this.site = randomFromArray(locationNameOne) + randomFromArray(locationNameTwo) + " " + randomFromArray(locationNameThree)
    }
}



