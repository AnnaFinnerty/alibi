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
        const sidebar = document.createElement("div");
        sidebar.className = "sidebar"
        const sidebarProps = ["profession","home"]
        for(let i = 0; i < sidebarProps.length; i++){
            const prop = document.createElement('div');
            const prop_name = document.createElement('span');
                  prop_name.textContent = sidebarProps[i] + ":  ";
                  prop.append(prop_name)
            const prop_val = document.createElement('span');
                  prop_val.textContent = this.subject[sidebarProps[i]];
                  prop.append(prop_val)
            sidebar.appendChild(prop)
        }

        this.window.appendChild(sidebar);

        const main = document.createElement("div");
        main.className = "main"
    }
    close = () => {
        this.window.className = "hidden"
        while(this.window.firstChild){
            this.window.removeChild(this.window.firstChild)
        }
    }
}