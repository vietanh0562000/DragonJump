let LobbyScene = cc.Scene.extend({
    ctor: function (){
        this._super();
        this.container = ccs.load(res.lobbyScene).node;
        this.playButton = this.container.getChildByName("PlayButton");
        this.controller = new LobbyController();

        this.playButton.addClickEventListener(this.controller.playGame);

        buildUI(this.container);
        this.addChild(this.container);
    }
})