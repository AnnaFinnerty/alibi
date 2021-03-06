function generateSuspects(location,mystery){
    console.log('generating suspects');
    // console.log(mystery)
    victimsPostion['x'] = mystery.victim.locationHistory[0][2]['x'];
    victimsPostion['y'] = mystery.victim.locationHistory[0][2]['y'];
    let suspectsArr = [];
    const gender_assignments = ["male","male","male","male","female","female","female","female"]
    const sec_pos = [0,1,2,3,4,5,6,7]
    const secrets = [];
    for(let a = 0; a < 4; a++){
        secrets.push(randomFromArrayAndRemove(sec_pos))
    }
    // let victim = null;
    let last_suspect = null;
    let tempPartnerIndex = null;
    const randomDiscover = Math.floor(Math.random()*8)
    for(let i = 0; i < 8; i++){
        //add one to the index of the secret so we can pass it as a true/false value to makeCharacter
        const hasSecret = secrets.indexOf(i) + 1
        //the first person with a secret is guilty
        //they will be the only person in the room with the victim/object at the time of the crime

        //okay this parts confusing...
        //secrets 2 and 3 are partners, but there's no telling which one was randomly chosen selected first
        //store the index of the first partner to pass through in tempPartnerIndex
        //when the second partner passes through, use that index to find the partner
        //we'll set the other partner later
        let partner = null;
        if(hasSecret === 3 || hasSecret === 2){
            if(tempPartnerIndex != null){
                partner = suspectsArr[tempPartnerIndex]
            } else {
                tempPartnerIndex = i;
            }
        }
        
        const isHost = i === 0;
        const gender = randomFromArrayAndRemove(gender_assignments)
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
        
        //set the final position. 
        const endPosition = i === randomDiscover ? victimsPostion : null;
        const suspect = makeCharacter(location,isHost,endPosition,hasSecret,partner,gender,relative,local,mystery.site);
        suspectsArr.push(suspect)
        last_suspect = suspect
        if(relative){
            suspectsArr[i-1]['relative'] = suspect;
        }
        //now go back and update the first partner to be located
        if(partner){
            suspectsArr[tempPartnerIndex]['partner'] = suspect;
        }
    }

    

    //shuffle suspects and assign some people random roles
    // suspectsArr = shuffle(suspectsArr);

    const finalSuspects = {}
    //make final dict to retun
    for(let i = 0; i < suspectsArr.length; i++){
        finalSuspects[suspectsArr[i].name] = suspectsArr[i]
    }

    return finalSuspects
}

function makeCharacter(location,isHost,endPosition,hasSecret,partner,gender,relative,local,site){
    //insert the location of the viction at the tod for the murderer
    //also add the location of the secret rendezous for the pair sharing a secret
    let insertedLocation = null;
    let insertedIndex = null;
    const murderHour = 2;
    if(hasSecret === 1){
        //MTC HARDCODED MURDER HOUR
        insertedLocation = victimsPostion;
        insertedIndex = murderHour;
    } else if (hasSecret === 3 && partner){
        insertedLocation = partner.locationHistory[0][murderHour];
        insertedIndex = murderHour;
    }

    const trueLocs = this.genPath(location,3);
    const locHistory = [trueLocs,trueLocs]
    //assign gender to victims (one is provided for suspects)
    gender = gender ? gender : Math.random() < .5 ? "male" : "female";
    const firstName = gender === "female" ? randomFromArrayAndRemove(femaleFirstName) : randomFromArrayAndRemove(maleFirstName);
    const lastName = relative ? relative.name.split(' ')[1] : randomFromArrayAndRemove(suspectLastNames);
    const name = firstName + " " +  lastName
    const profession = gender === "female" ? randomFromArrayAndRemove(professionsFemale) : randomFromArrayAndRemove(professionsMale);
    const color = randomFromArrayAndRemove(colors)
    const home = isHost ? site : local ? site.split(" ")[0] : randomFromArrayAndRemove(locationsAway)
    let relation = null;
    if(relative){
        const type = randomFromArrayAndRemove(femaleRelations);
        relation = {name:relative.name, relation: type}
    }

    let clue = null;
    //the second and third people only have one clue
    if(hasSecret && hasSecret !== 2){
        clue = {
                    object: randomFromArrayAndRemove(clues),
                    loc: randomFromArray(locHistory[1])
               }
    }
    
    const character = new Suspect(name,color,locHistory,isHost,hasSecret,clue,local,home,profession,relation,partner);   
    return character
}

const body = document.querySelector('body')
const button = document.querySelector('button')

const fonts = ['Arial','Times New Roman','Helvetica']
let fontNum = 0

button.addEventListener('click',() => {
    //advance unless at end of array
    fontNum = fontNum + 1 > fonts.length - 1 ? 0 : fontNum + 1;
    body.style.fontFamily = fonts[fontNum];
})

function genPath(location,segments=3,insertPosition,insertIndex){
    // console.log('generating path',crossoverPaths)
    //start the path from the inserted position
    const start = insertPosition ? insertPosition : randomStartPosition(location);
    // console.log('start',start)
    const path = [start]
    const testPath = [];
    testPath.push(start.x+"_"+start.y)
    let counter = 0;
    let x = start.x;
    let y = start.y;
    while(counter < segments){
        const pos = nextPos(location,x,y,testPath);
        if(insertPosition && insertIndex && (counter > insertIndex)){
            path.unshift(pos)
            testPath.unshift(pos.x+"_"+pos.y)
        } else {
            path.push(pos)
            testPath.push(pos.x+"_"+pos.y)
        }
        x = pos.x;
        y = pos.y;
        counter++;
    }
    //return the path reversed
    return path.reverse()
}

const victimsPostion = {x:null,y:null}

function nextPos(location,currentX,currentY,testPath){
    let possiblePaths = [];
    if(currentX > 0){
        if(location[currentX-1][currentY] !== "empty"){
            possiblePaths.push({x:currentX-1,y:currentY,name:location[currentX-1][currentY],known:false})
        } 
    }
    if(currentX < location.length-1){
        if(location[currentX+1][currentY] !== "empty"){
            possiblePaths.push({x:currentX+1,y:currentY,name:location[currentX+1][currentY],known:false})
        } 
        
    }
    if(currentY > 0){
        if(location[currentX][currentY-1] !== "empty"){
            possiblePaths.push({x:currentX,y:currentY-1,name:location[currentX][currentY-1],known:false})
        } 
    }
    if(currentY < location[0].length-1){
        if(location[currentX][currentY+1] !== "empty"){
            possiblePaths.push({x:currentX,y:currentY+1,name:location[currentX][currentY+1],known:false})
        } 
    }
    const limitedPaths = possiblePaths.filter((path)=> !testPath.includes(path.x+"_"+path.y))
    return limitedPaths.length ? randomFromArray(limitedPaths) : randomFromArray(possiblePaths)
}

// let location = null;

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
    "Constantine", "Arbuthnot", 'Carlisle', 'Ackroyd', "Inglethorp", "Redfern", "Gardener",
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
