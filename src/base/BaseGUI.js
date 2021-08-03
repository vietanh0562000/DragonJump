let fr = fr || {}

fr.viewScene = function (Scene, transitionTime){
    let scene = new Scene();
    if (!transitionTime){
        transitionTime = 1;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
}

fr.viewLayer = function (Layer, transitionTime){
    let scene = new cc.Scene();
    let layer = new Layer();
    scene.addChild(layer);
    if (!transitionTime){
        transitionTime = 0.5;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
}

fr.getCurrentScreen = function (){
    return cc.director.getCurrentScreen();
}