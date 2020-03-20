function generateSuspects(location,c){
    console.log('generating suspects');
    const suspects = {}
    const sec_pos = [0,1,2,3,4,5,6,7]
    const secrets = [];
    for(let a = 0; a < 3; a++){
        secrets.push(randomFromArrayAndRemove(sec_pos))
    }
    // let victim = null;
    for(let i = 0; i < 8; i++){
        const hasSecret = secrets.includes(i)
        const isHost = i === 0;
        let gender
        if(i<4){
            gender = "female"
        } else {
            gender = "male"
        }
        let local = true;
        //the host will always be local
        if(i > 0){
            const loc_r = Math.random();
            if(loc_r < .5){
                local = false
            }
        }
        const rel_r = Math.random();
        const suspect = makeCharacter(location,c.victim.locationHistory,isHost,hasSecret,gender,local,c.site);
        suspects[suspect.name] = suspect
    }
    return suspects
}

function makeCharacter(location,victimsPath,isHost,hasSecret,gender,local,site){
    //generate the characters path from the victims path
    // console.log('victims paths', victimsPath)
    const locHistory = this.genPath(location,victimsPath);
    // console.log('locHistory', locHistory)
    gender = gender ? gender : Math.random() < .5 ? "male" : "female";
    let firstName, profession;
    if(gender === "female"){
        firstName = randomFromArrayAndRemove(femaleFirstName);
        profession = randomFromArrayAndRemove(professionsFemale)
    } else {
        firstName = randomFromArrayAndRemove(maleFirstName);
        profession = randomFromArrayAndRemove(professionsMale)
    }

    let clue = null;
    if(hasSecret){
        clue = {
                    object: randomFromArrayAndRemove(clues),
                    loc: randomFromArray(locHistory)
               }
    }
    const name = firstName + " " +  randomFromArrayAndRemove(suspectLastNames)
    const color = randomFromArrayAndRemove(colors)
    const home = local ? site : randomFromArrayAndRemove(locationsAway)
    const character = new Suspect(name,color,locHistory,isHost,hasSecret,clue,local,home,profession);   
    return character
}

function genPath(location,crossoverPaths){
    // console.log('generating path',crossoverPaths)
    let start;
    if(!crossoverPaths){
        start = randomStartPosition();
    } else {
        start = crossoverPaths[Math.floor(Math.random()*crossoverPaths.length)]
    }
    // console.log('start',start)
    const possiblePaths = []
    if(start.x > 0){
        if(location[start.x-1][start.y] !== "empty"){
            possiblePaths.push({x:start.x-1,y:start.y})
        } 
    }
    if(start.x < location.length-1){
        if(location[start.x+1][start.y] !== "empty"){
            possiblePaths.push({x:start.x+1,y:start.y})
        } 
        
    }
    if(start.y > 0){
        if(location[start.x][start.y-1] !== "empty"){
            possiblePaths.push({x:start.x,y:start.y-1})
        } 
    }
    if(start.y < location[0].length-1){
        if(location[start.x][start.y+1] !== "empty"){
            possiblePaths.push({x:start.x,y:start.y+1})
        } 
    }
    const r1 = Math.floor(Math.random()*possiblePaths.length);
    const s1 = possiblePaths[r1];
    possiblePaths.splice(r1,1)
    const r2 = Math.floor(Math.random()*possiblePaths.length);
    const s2 = possiblePaths[r2];
    possiblePaths.splice(r2,1)
    return [s1, start, s2]
}

function randomStartPosition(location){
    return {x:1,y:2}
}

const colors = ["firebrick","rebeccapurple",'midnightblue','olive','palevioletred','royalblue','tomato','teal','maroon']

const professionsMale = ["vicar","doctor","gadabout","gambler","banker","MP","gardener"]

const professionsFemale = ["wife","housewife","mother","heiress", "doctor","professor","adventurer"]

const locationsAway = ["China","India","Egypt","Kenya","Greece","Italy","France"]

const suspectLastNames = [
    "Constantine", "Arbuthnot", "de Bellefort", 'Ackroyd', "Inglethorp", "Redfern", "Gardener",
     "Brewster", "Blatt", "Argyle", "MacMaster"
]

const femaleFirstName = [
    "Jaqueline", "Mary", "Emily", "Arlena", "Linda", "Carrie", "Rosamund", "Christine"
]

const maleFirstName = [
    "Tom", "John", "Alfred", "Patrick", "Horace", "Odell", "Stephen", "Kenneth", "Jacko"
]

const femaleRelations= [
    "mother","daughter","aunt","sister","neice"
]

const maleRelations= [
    "father","son","uncle","brother","nephew"
]

const secrets = ['Drunkard','Drugs']
const doubleSecrets = ['Adultery','Stock Scheme']

const clues = ['Cigarette Lighter','Pipe','Ring','Shoeprint']
const doubleClues = ['Letter','Handkerchief']
