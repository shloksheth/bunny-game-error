const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground,rope_2,rope_3;
var fruit_con;
var fruit_con_2;
var fruit_con_3;

var bg_img;
var food;
var rabbit;

var button;
var button1;
var button2;
var bunny;
var blink,eat,sad;

var blower;
var backgroundSound, sadSound, eatSound, cutSound, airSound
var mute;

var W, H;


function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  blink = loadAnimation('blink_1.png','blink_2.png','blink_3.png');
  eat = loadAnimation('eat_0.png','eat_1.png','eat_2.png','eat_3.png','eat_4.png');
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  backgroundSound = loadSound("sound1.mp3")
  eatSound = loadSound("eating_sound.mp3")
  cutSound = loadSound("rope_cut.mp3")
  sadSound = loadSound("sad.wav")
  airSound = loadSound("air.wav")

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (isMobile){
    W = displayWidth
    H = displayHeight
    createCanvas(displayWidth+80,displayHeight);
  }
  else{
    W = windowWidth
    H = windowHeight
    createCanvas(windowWidth,windowHeight);
  }
  frameRate(80);

  backgroundSound.play(); 
  backgroundSound.setVolume(0.3);

  engine = Engine.create();
  world = engine.world;
  
  blink.frameDelay = 25;
  eat.frameDelay = 20;
  sad.frameDelay = 15

  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button1 = createImg('cut_btn.png');
  button1.position(50,150);
  button1.size(50,50);
  button1.mouseClicked(drop1);

  button2 = createImg('cut_btn.png');
  button2.position(400,80);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  blower = createImg('balloon.png');
  blower.position(20,250);
  blower.size(150,100);
  blower.mouseClicked(blow);

  mute = createImg("mute.png");
  mute.position(400,40);
  mute.size(50,50)
  mute.mouseClicked(muting);
  

  bunny = createSprite(145,H-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking",blink)
  bunny.addAnimation("eating",eat)
  bunny.addAnimation("being sad",sad)

  bunny.changeAnimation("blinking");
  
  rope = new Rope(7,{x:245,y:30});
  rope_2 = new Rope(7,{x:75,y:160});
  rope_3 = new Rope(7,{x:425,y:90});
  ground = new Ground(200,H,600,20);
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope_2,fruit);
  fruit_con_3 = new Link(rope_3,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,0,0,displayWidth+80,displayHeight);

  if (fruit != null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  rope_2.show();
  rope_3.show();
  Engine.update(engine);
  ground.show();

  if (collide(fruit,bunny)==true){
    bunny.changeAnimation("eating");
    eatSound.play();
  }

  if (collide(fruit,ground.body)==true){
    bunny.changeAnimation("being sad");
    sadSound.play();
  }

  /*if (fruit.position.y>=650 && fruit != null){
    bunny.changeAnimation("being sad");
    sadSound.play();
    backgroundSound.stop();   
    wait (2000)
    sadSound.stop();
  }*/
    
  drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cutSound.play(); 
}

function drop1()
{
  rope_2.break();
  fruit_con_2.detach();
  fruit_con_2 = null;
  cutSound.play(); 
}

function drop2()
{
  rope_3.break();
  fruit_con_3.detach();
  fruit_con_3 = null;
  cutSound.play(); 
}

function collide(body,sprite)
{
  if (body != null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if (d<60){
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function blow()
{
  Matter.Body.applyForce(fruit,{
    x:0,
    y:0
  },{
    x:0.01,
    y:0
  });
  airSound.setVolume(0.5);
  airSound.play(); 

}

function muting()
{
  if (backgroundSound.isPlaying()){
    backgroundSound.stop();
  }
  else {
    backgroundSound.play();
  }

}
