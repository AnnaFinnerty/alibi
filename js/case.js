class Case{
    constructor(victim){
        this.victim = victim;
        const locationNameOne = ['Here','Gos','Dun','Abby','Bor'];
        const locationNameTwo = ['ford','mann','wyn','shire','lop'];
        const locationNameThree = ['House','Manor','Park','Castle'];
        const type = ['Murder','Theft','Kidnapping'];
        this.site = randomFromArray(locationNameOne) + randomFromArray(locationNameTwo) + " " + randomFromArray(locationNameThree)
    }
}



