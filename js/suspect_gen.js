function generateSuspects(location,mystery){
    console.log('generating suspects');
    victimsPostion['x'] = mystery.victim.locationHistory[2]['x'];
    victimsPostion['y'] = mystery.victim.locationHistory[2]['y'];
    console.log(victimsPostion)
    const suspects = {}
    const sec_pos = [0,1,2,3,4,5,6,7]
    const secrets = [];
    for(let a = 0; a < 4; a++){
        secrets.push(randomFromArrayAndRemove(sec_pos))
    }
    // let victim = null;
    let last_suspect = null;
    for(let i = 0; i < 8; i++){
        //add one to the index of the secret so we can pass it as a true/false value to makeCharacter
        const hasSecret = secrets.indexOf(i) + 1
        //the first person with a secret is guilty
        //they will be the only person in the room with the victim/object at the time of the crime
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
        //give some characters a random familial relationship with the suspect befores
        const rel_r = Math.random();
        const relative = rel_r < .3 ? last_suspect : null;

        const suspect = makeCharacter(location,mystery.victim.locationHistory,isHost,hasSecret,relative,gender,relative,local,mystery.site);
        suspects[suspect.name] = suspect
        last_suspect = suspect
    }
    return suspects
}

function makeCharacter(location,victimsPath,isHost,hasSecret,partner,gender,relative,local,site){
    //generate the characters path from the victims path
    // console.log('victims paths', victimsPath)
    const locHistory = this.genPath2(location,3);
    const testPath = this.genPath2(location);
    console.log('test path', testPath)
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
    const name = firstName + " " +  randomFromArrayAndRemove(suspectLastNames)
    const color = randomFromArrayAndRemove(colors)
    const home = local ? site : randomFromArrayAndRemove(locationsAway)

    let clue = null;
    if(hasSecret){
        clue = {
                    object: randomFromArrayAndRemove(clues),
                    loc: randomFromArray(locHistory)
               }
    }
    
    const character = new Suspect(name,color,locHistory,isHost,hasSecret,clue,local,home,profession);   
    return character
}

function genPath(location,crossoverPaths){
    // console.log('generating path',crossoverPaths)
    let start = randomStartPosition(location);
    if(!crossoverPaths){
        start = randomStartPosition(location);
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

function genPath2(location,segments=3){
    // console.log('generating path',crossoverPaths)
    const start = randomStartPosition(location);
    console.log('start',start)
    const path = [start]
    let counter = 0;
    let x = start.x;
    let y = start.y;
    while(counter < segments){
        const pos = nextPos(location,x,y,path);
        console.log(pos)
        path.push(pos)
        x = pos.x;
        y = pos.y;
        counter++;
    }
    return path
}

function nextPos(location,currentX,currentY,locationHistory){
    let possiblePaths = []
    if(currentX > 0){
        if(location[currentX-1][currentY] !== "empty"){
            possiblePaths.push({x:currentX-1,y:currentY})
        } 
    }
    if(currentX < location.length-1){
        if(location[currentX+1][currentY] !== "empty"){
            possiblePaths.push({x:currentX+1,y:currentY})
        } 
        
    }
    if(currentY > 0){
        if(location[currentX][currentY-1] !== "empty"){
            possiblePaths.push({x:currentX,y:currentY-1})
        } 
    }
    if(currentY < location[0].length-1){
        if(location[currentX][currentY+1] !== "empty"){
            possiblePaths.push({x:currentX,y:currentY+1})
        } 
    }
    // possiblePaths = possiblePaths.map((path)=> !locationHistory.includes(path))
    return randomFromArray(possiblePaths)
}

// let location = null;
const victimsPostion = {x:null,y:null}
const startPositions = []

function randomStartPosition(location){
    if(!startPositions.length){
        for(let x = 0; x < location.length; x++){
            for(let y = 0; y < location[y].length; y++){
                if(location[x][y] !== "empty"){
                    if(x != victimsPostion['x'] && y != victimsPostion['y']){
                        startPositions.push({x:x,y:y})
                    }
                }
            }
        }
    }
    return randomFromArray(startPositions)
}

const colors = ["crimson","darkorchid",'midnightblue','olive', 'palevioletred','royalblue','tomato','teal','darkgoldenrod','indigo']

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
