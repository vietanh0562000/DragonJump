let LobbyController = cc.Class.extend({
    ctor: function (){

    },

    playGame: function (){
        fr.viewScene(GamePlayScene);
    }
})