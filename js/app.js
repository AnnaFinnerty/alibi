class App{
    constructor(){
        this.game = null;
        this.player = new Player();
        this.inspector = new Inspector();
        this.awake();
    }
    awake = () => {
        this.newGame();
    }
    newGame = () => {
        
        this.game = new Game();
    }
}

new App();