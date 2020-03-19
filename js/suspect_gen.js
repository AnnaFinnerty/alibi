function generateSuspects(location){
    console.log('generating suspects');
    const suspects = {}
    let victim = null;
    for(let i = 0; i < 8; i++){
        let gender, firstName
        if(i<4){
            gender = "female"
            firstName = randomFromArrayAndRemove(femaleFirstName);
        } else {
            gender = "male"
            firstName = randomFromArrayAndRemove(maleFirstName);
        }
        const name = firstName + " " +  randomFromArrayAndRemove(suspectLastNames)
        const color = randomFromArrayAndRemove(colors)
        const victimsPath = i === 0 ? null : victim.locationHistory
        console.log('victims paths', victimsPath)
        const locHistory = this.genPath(location,victimsPath);
        console.log('locHistory', locHistory)
        const suspect = new Suspect(name,color,locHistory);
        console.log('suspect',suspect)
        if(i === 0){
            victim = suspect
        }
        suspects[name] = suspect
    }
    return suspects
}

function makeCharacter(location,victimsPath,gender){
    console.log('generating character');
    gender = gender ? gender : Math.random() < .5 ? "male" : "female";
    let firstName;
    if(gender = "female"){
        firstName = randomFromArrayAndRemove(femaleFirstName);
    } else {
        firstName = randomFromArrayAndRemove(maleFirstName);
    }
    const name = firstName + " " +  randomFromArrayAndRemove(suspectLastNames)
    const color = randomFromArrayAndRemove(colors)
    console.log('victims paths', victimsPath)
    const locHistory = this.genPath(location,victimsPath);
    console.log('locHistory', locHistory)
    const character = new Suspect(name,color,locHistory);   
    return character
}

function genPath(location,crossoverPaths){
    console.log('generating path',crossoverPaths)
    let start;
    if(!crossoverPaths){
        start = randomStartPosition();
    } else {
        start = crossoverPaths[Math.floor(Math.random()*crossoverPaths.length)]
    }
    console.log('start',start)
    const possiblePaths = []
    if(start.x > 0){
        possiblePaths.push({x:start.x-1,y:start.y})
    }
    if(start.x < location[0].length-1){
        possiblePaths.push({x:start.x+1,y:start.y})
    }
    if(start.y > 0){
        possiblePaths.push({x:start.x,y:start.y-1})
    }
    if(start.y < location.length-1){
        possiblePaths.push({x:start.x,y:start.y+1})
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

const locationsHere = ["Dunswallow","Albershames"]

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


