

class Case{
    constructor(victim){
        this.victim = victim;
        const locationNameOne = ['Here','Gos','Dun','Abby','Bor'];
        const locationNameTwo = ['ford','mann','wyn','shire','lop'];
        const locationNameThree = ['House','Manor','Park','Castle'];
        const p1 = randomFromArray([1,2,3])
        console.log(p1)
        this.site = locationNameOne[0] + locationNameTwo[0] + " " + locationNameThree[0]
    }
}



