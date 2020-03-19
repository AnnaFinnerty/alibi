class DialogueWindow{
    constructor(){
        this.suspect = null;
        this.panel = "view"
        this.suspectProps = ['name']
        this.displayElements = {}
        for(let i = 0; i < this.suspectProps.length; i++){
            const el = document.querySelector('#suspect-'+this.suspectProps[i]);
            this.displayElements[this.suspectProps[i]] = el
        }
        console.log(this.displayElements)
    }
    build = (suspect) => {
        console.log('building suspect: ' + suspect)
        this.suspect = suspect;
        for(let i in this.displayElements){
            this.displayElements[i].textContent = suspect[i]
        }
    }
    close = () => {
        return this.suspect
    }
}