import * as PIXI from '../lib/pixi';
import { TweenLite } from "gsap";

module.exports = class CanvasStripes {
  constructor(diagonalWidth, stripeAngle, stripeQuantity) {
    this.diagonalWidth = diagonalWidth;
    this.stripeQuantity = stripeQuantity;
    this.stripeAngle = stripeAngle;
    this.canvasWidth = document.body.offsetWidth;
    this.canvasHeight = document.body.offsetHeight;
    this.app = new PIXI.Application(this.canvasWidth, this.canvasHeight, { antialias: true, transparent: true, view: document.querySelector('#canvas') });
    this.app.stage.alpha = 1;
    this.makeMainContainer();
    this.makeStripe();
    this.makeImgSprite();
    this.app.stage.addChild(this.mainContainer);
    this.selectItemHandler = this.selectItemHandler.bind(this);
  }
  makeImgSprite() {
    this.imgSprite = new PIXI.Sprite();
    this.imgSprite.anchor.set(0.5);
    this.imgSprite.y = this.stripeHeight/2;
    this.imgSprite.rotation = -this.stripeAngle;
    this.imgSprite.mask = this.stripe;
    this.mainContainer.addChild(this.imgSprite);      
  }
  makeMainContainer() {
    this.mainContainer = new PIXI.Container();
    this.mainContainerHeight = this.app.renderer.height * 2;
    this.mainContainerWidth = this.diagonalWidth;
    this.mainContainer.rotation = this.stripeAngle;    
    this.mainContainer.x = this.app.renderer.width / 2;
    this.mainContainer.y = this.app.renderer.height / 2;
    this.mainContainer.width = this.mainContainerWidth;
    this.mainContainer.height = this.mainContainerHeight;
    this.mainContainer.pivot.set(this.mainContainerWidth/2,this.mainContainerHeight/2);
  }
  makeStripe() {
    this.stripe = new PIXI.Graphics();
    this.stripeWidth = this.diagonalWidth/this.stripeQuantity;
    this.stripeHeight = this.app.renderer.height * 2;
    this.stripe.lineStyle(0);
    this.stripe.beginFill(0xe74c3c, 1);
    this.stripe.drawRect(0, 0, this.stripeWidth, this.stripeHeight);
    this.stripe.endFill();
    this.stripe.position.y = this.stripeHeight/2; 
    this.stripe.interactive = true;
    this.stripe.buttonMode = true;
    this.stripe.pivot.set(this.stripeWidth/2, this.stripeHeight/2);
    this.mainContainer.addChild(this.stripe);
  }
  returnImgPath(image) {
    let imagePath = '/images/portfolio/thumb/' + image + '.jpg'
    return imagePath;
  }
  selectItemHandler(number_position, image, text) {
    TweenLite.to(this.app.stage, .3, { alpha: 1});
    this.stripe.width = this.stripeWidth;
    this.app.view.style.zIndex = '1000';
    if(!PIXI.loader.resources[image]) {
      PIXI.loader
      .add(image, this.returnImgPath(image))
      .load(this.onAssetsLoaded.bind(this, image))
    } else {
        this.onAssetsLoaded(image);
    }
    switch(number_position) {
      case '1':
        this.stripe.position.x = 1 * this.stripeWidth/2;
        this.imgSprite.x = 1 * this.stripeWidth/2;
        
        break;
      case '2':
        this.stripe.position.x = 3 * this.stripeWidth/2;
        this.imgSprite.x = 3 * this.stripeWidth/2;
        
        break;
      case '3':
        this.stripe.position.x = 5 * this.stripeWidth/2;
        this.imgSprite.x = 5 * this.stripeWidth/2;
        
        break;
      case '4':
        this.stripe.position.x = 7 * this.stripeWidth/2;
        this.imgSprite.x = 7 * this.stripeWidth/2;
        
        break;
    }
  }

  onAssetsLoaded(image) {
    let imgTexture = PIXI.loader.resources[image].texture;
    this.imgSprite.texture = imgTexture;
    let scale = this.canvasWidth/imgTexture.orig.width;
    if(this.canvasWidth < this.сanvasHeight) {
      scale = this.canvasHeight*1.8/imgTexture.orig.width;
    }
    this.imgSprite.scale.set(scale, scale);
  
    TweenLite.to(this.stripe, 1, {delay: .3, x: this.diagonalWidth/2, width: this.diagonalWidth});
    TweenLite.to(this.imgSprite, .3, {delay: .2, x: this.mainContainerWidth/2, y: this.mainContainerHeight/2});
    TweenLite.to(this.app.view.style, .1, {delay: 2, zIndex: '-1'});
    TweenLite.to(this.app.stage, .6, {delay: 1.5, alpha: 0, onComplete: () =>  this.imgSprite.texture=null });

  }
}