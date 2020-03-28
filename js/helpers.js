function randomFromArrayAndRemove(arr){
    const r = Math.floor(Math.random()*arr.length);
    const obj = arr[r];
    arr.splice(r,1)
    return obj
}

function randomFromArray(arr){
    return arr[Math.floor(Math.random()*arr.length)]
}

function buildObject(type,container,className,id){
    const obj = document.createElement(type);
          obj.className = className;
          obj.id = id
    container.appendChild(obj)
    return obj
}

function emptyContainer(container){
    if(container.firstChild){
        while(container.firstChild){
            container.removeChild(container.firstChild)
        }
    }
}

function playText(container,text,wordDelay,longDelay){
    container.textContent = text; 
}

function timer(callback,time){
    setTimeout(callback,time)
}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
