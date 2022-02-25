var trex, trex_correndo, bordas, solo, soloInvisivel, imagemDaNuvem, obstaculo, pontuacao, grupoDeNuvens, grupoDeObstaculos, trex_colidiu, imagemDoSolo, obstaculo, obstaculo1,obstaculo2,imagemFimDoJogo, imagemReiniciar, somSalto, somMorte, somCheckPoint, fimDoJogo, reiniciar, nuvem, fundo,sol, solImg;

var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo= JOGAR;

function preload(){
  
  fundo = loadImage('fundocor.png');
  solImg = loadImage('solcor.png');
  
  //criar animação do T-Rex correndo
  trex_correndo = loadAnimation('trex1cor.png','trex2cor.png','trex3cor.png');
  
  //criar animação do T-Rex
  trex_colidiu = loadAnimation("trex_colidiucor.png");
  
  //carregar imagem do solo
  imagemDoSolo = loadImage("solocor.png");
  
  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvemcor.png");
  
  // carregar imagens dos obstaculos
  obstaculo1 = loadImage("obstaculo1cor.png");
  obstaculo2 = loadImage("obstaculo2cor.png");
  
  //carregar imagens de final
  imagemFimDoJogo= loadImage("fimDoJogocor.png");
  imagemReiniciar= loadImage("reiniciarcor.png");
  
  //carregar sons
  somSalto = loadSound("pulo.mp3");
  somMorte = loadSound("morte.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup(){
  
  //cria a tela
  createCanvas(windowWidth,windowHeight);
  
  sol = createSprite(width-50,40);
  sol.addImage('sol', solImg);
  sol.scale = 0.15;
  
  //cria solo
  solo = createSprite(width/2,height,width,20);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo)
  solo.x = width/2;
  solo.scale = 0.6;
  
  //cria solo invisível
  soloInvisivel = createSprite(300,height-10,600,10);
  soloInvisivel.visible = false;
  
  //cria sprite do T-Rex
  trex = createSprite(50,height-100,20,50);
  trex.scale = 0.1;
  trex.x = 50;
  //adiciona a animação de T-Rex correndo ao sprite
  trex.addAnimation("correndo", trex_correndo);
  //adiciona a animação de T-rex colidindo ao sprite
  trex.addAnimation("colidiu" , trex_colidiu);
  
  //atribuir valor inicial à pontuação
  pontuacao = 0
  
  //criar grupos de nuvens e obstáculos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  //adicionar e ajustar imagens do fim
  fimDoJogo = createSprite(width/2,height/2-20,400,20);
  fimDoJogo.addImage(imagemFimDoJogo);

  reiniciar = createSprite(width/2,height/2+20);
  reiniciar.addImage(imagemReiniciar);

  fimDoJogo.scale = 0.5;
  fimDoJogo.depth = fimDoJogo.depth+100
  reiniciar.scale = 0.07;
  reiniciar.depth = reiniciar.depth+100
  fimDoJogo.visible = false;
  reiniciar.visible = false;
  
  
  trex.setCollider("circle",0,0);
  
  //para Trex inteligente
  //trex.setCollider("rectangle",250,0);

}

function draw(){
  //fundo branco
  background(fundo);
  
  fill('white');
  textSize(16);
  text("Pontuação: "+pontuacao,width/2-50,30);
  
  //desenha os sprites
  drawSprites();
  
  //Trex colide com o solo
  trex.collide(soloInvisivel);
   
  //estados de jogo
  if(estadoJogo === JOGAR){
  
    
    //faz o T-Rex correr adicionando velocidade ao solo
    solo.velocityX = -(8 + pontuacao/30);
    //faz o solo voltar ao centro se metade dele sair da tela
    if (solo.x<0){
      solo.x=width/2;
    }
    
    //som a cada 100 pontos
    if(pontuacao>0 && pontuacao%100 === 0){
        somCheckPoint.play();
    }
    
    //T-Rex pula ao apertar espaço
    if(touches.length>0 && trex.y>height-80 || keyDown('space') && trex.y>height-80){
      trex.velocityY = -16; 
      somSalto.play();
      touches = [];
    }
    
    //gravidade
    trex.velocityY = trex.velocityY + 1;
    
    //gerar nuvens
    gerarNuvens();
    //gerar obstáculos
    gerarObstaculos();
    
    //pontuação continua rodando
    pontuacao = pontuacao + Math.round(frameRate()/42)
    

    //imagens do fim ficam invisíveis
    fimDoJogo.visible = false;
    reiniciar.visible = false;
    
    //quando o trex toca o obstáculo, o jogo se encerra
    if(grupoDeObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      //som de morte
      somMorte.play();
      
      //Trex inteligente
      //trex.velocityY= -12;
      //somSalto.play();
    }
  } else if(estadoJogo === ENCERRAR){
    //para os sprites em movimento
    trex.velocityY =0;
    solo.velocityX = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    //animação de T-Rex colidido
    trex.changeAnimation("colidiu" , trex_colidiu);
    
    //mostrar imagens do fim
    fimDoJogo.visible = true;
    reiniciar.visible = true;
    
    if(mousePressedOver(reiniciar)|| touches.length>0){
      reinicie();
      touches = [];
    }
    
  }
}

function gerarNuvens(){
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if(frameCount %60 === 0){
    nuvem = createSprite(width,300,40,10);
    nuvem.y = Math.round(random(40,height*2/3));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale =0.4;
    //ajustar profundidade da nuvem
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    //dar velocidade e direção à nuvem
    nuvem.velocityX=-3;
    //dar tempo de vida à nuvem
    nuvem.lifetime = width/3+20;
    //adicionar a um grupo
    grupoDeNuvens.add(nuvem);
  }
}

function gerarObstaculos(){
  //criar sprite de obstáculo a cada 60 quadros
  if(frameCount %40 === 0){
    obstaculo = createSprite(width,height-50,10,40);
    obstaculo.velocityX= solo.velocityX
  
    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1,2));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
        	break;
      case 2: obstaculo.addImage(obstaculo2);
        	break;
      case 4: obstaculo.addImage(obstaculo4);
        	break;
      default: break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    obstaculo.scale = 0.4;
    obstaculo.lifetime = width/4;
    //ajustar profundidade da nuvem
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth +1;
    //adicionar a um grupo
    grupoDeObstaculos.add(obstaculo);
  }
}

function reinicie(){
  estadoJogo = JOGAR;
  fimDoJogo.visible = false;
  reiniciar.visible = false;
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  trex.changeAnimation("correndo", trex_correndo);
  
  pontuacao = 0;
}