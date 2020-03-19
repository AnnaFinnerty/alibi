class DialogueWindow{
    constructor(window,subject){
        this.window = window;
        this.subject = subject;
        this.window.className = "";
        this.build();
    }
    build = () => {
        console.log('subject', this.subject)
        const close = document.createElement("button")
        close.className = "close-button"
        close.addEventListener("click",this.close)
        close.textContent = "X"
        this.window.appendChild(close)
        const header = document.createElement("h2");
        header.textContent = this.subject.name;
        this.window.appendChild(header);
    }
    close = () => {
        this.window.className = "hidden"
        while(this.window.firstChild){
            this.window.removeChild(this.window.firstChild)
        }
    }
}