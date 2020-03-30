
//row is response type
//column is personality type

const greetings = [
    ['Hello'],
    ['I found the body']
]

//aligns questions input to suitable rows in responses array
//other response backups are built into suspect class
const responsePaths = {
    0: [0],
    1: [0],
    2: [0]
}

const responses = [
    //location response
    ["Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t",
     "Of course, happy to tell you. I was in the %l at %t"],
    //obsfucate
    ["I'm so sorry inspector, I'm afraid I can't remember",
     "Dear me, afraid it's slipped my mind.", 
     "Wouldn't you like to know?",
     "I'm getting tired of all these questions",
     "I'm getting tired of all these questions",
     "I'm getting tired of all these questions",
     "I'm getting tired of all these questions",
     "I'm getting tired of all these questions",
     "I'm getting tired of all these questions",
     "I'm getting tired of all these questions"
    ],
]