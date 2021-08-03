let GameOverScene = cc.Scene.extend({
    ctor: function (){
        this._super();
        this.container = ccs.load(res.gameOverScene).node;
        this.playButton = this.container.getChildByName("PlayButton");
        this.homeButton = this.container.getChildByName("HomeButton");
        this.score = this.container.getChildByName("Score");
        this.best = this.container.getChildByName("Best");

        this.score.setString("Score: " + gv.score.toString());
        this.best.setString("Best: " + gv.bestScore.toString());
        this.playButton.addClickEventListener(this.playGame);
        this.homeButton.addClickEventListener(this.returnHome);
        buildUI(this.container);
        this.addChild(this.container);
    },

    playGame: function (){
        fr.viewScene(GamePlayScene);
    },

    returnHome: function (){
        fr.viewScene(LobbyScene);
    },
})