let bulletArray = [];
let monsterBulletArray = [];

let impactAnimationArray = [];

let noOfBullets = 0;

let currentWeapon = 0;
let currentSrc = "./Bullet/Bullet0.png";

let bulletImage = new Image(20, 20);
bulletImage.src = "./Bullet/Bullet0.png";

let enemyBulletImage = new Image(20, 20);
enemyBulletImage.src = "./Bullet/enemyBullet.png";

let piercing = 0;
let lightning = 0;
let stunMode = 0;
let statusDMGMode = 1;

let piercingGemBuff = 0;

// Control SFX
let musicAllowed = true;
let SFXAllowed = true;


// CurrentLocation and Destination are objects:
// {x: ; y: }

class ImpactAnimation {
    constructor(startX, startY, impactSprite, spriteLength, destinationWidth, destinationHeight) {
        this.startX = startX-60;
        this.startY = startY-60;
        this.impactSprite = impactSprite;
        this.frameRate = 0;
        this.currentFrameIndex = 0;
        this.spriteLength = spriteLength;
        this.destinationWidth = destinationWidth;
        this.destinationHeight = destinationHeight;
        this.frameSpeed = 1;
        impactAnimationArray.push(this);
    }

    runAnimation() {
        this.frameRate++;
        if (this.frameRate % this.frameSpeed == 0) {
            this.currentFrameIndex++;
            if (this.currentFrameIndex > this.spriteLength) {
                impactAnimationArray.splice(impactAnimationArray.findIndex((index)=>{return index==this}),1);
            }
        }
        
        if (this.currentFrameIndex < this.spriteLength) {
            
            screenContext.drawImage(this.impactSprite.sprites[this.currentFrameIndex], this.startX, this.startY, this.destinationWidth, this.destinationHeight);
        }
    }
}

class Bullet {
    constructor (damage, currentLocation, destination, lifeTime, speed, width, height, side) {
        this.damage = damage;
        this.id = noOfBullets;
        this.currentLocation = currentLocation;
        this.destination = destination;
        this.lifeTime = lifeTime;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.side = side;
        this.moveY = (destination.y - currentLocation.y) / (Math.sqrt(Math.pow((destination.x - currentLocation.x),2) + Math.pow((destination.y - currentLocation.y),2)));
        this.moveX = (destination.x - currentLocation.x) / (Math.sqrt(Math.pow((destination.x - currentLocation.x),2) + Math.pow((destination.y - currentLocation.y),2)));
        this.dealtDamage = [];
        
        if (side == 0) {
            bulletArray.push(this);
        } else if (side == 1) {
            monsterBulletArray.push(this);
        }

        this.type = 0; // NOTE THE TYPE FOR MONSTERS: 
        // Type 0: Shoot All
        // Type 1: Only Shoot Person.
        // Type 2: Only Shoot Base.


        noOfBullets++;
    }

    runBullet() {
        this.lifeTime--;
        if (this.currentLocation.y > 540) {
            this.lifeTime = -1;
        }

        if (this.lifeTime > 0) {
            this.currentLocation.x += this.speed*this.moveX;
            this.currentLocation.y += this.speed*this.moveY;
            if (this.side == 0) {
                this.characterBulletCollisionDetect();
            } else if (this.side == 1) {
                this.monsterBulletCollisionDetect();
            }
        } else {
            //console.log("Index of Bullet " + this.id + ": " + bulletArray.findIndex((index)=>{return index==this}));
            if (this.side == 0) {
                this.dealtDamage = [];
                bulletArray.splice(bulletArray.findIndex((index)=>{return index==this}),1);
            } else if (this.side == 1) {
                monsterBulletArray.splice(monsterBulletArray.findIndex((index)=>{return index==this}),1);
            }
            //console.log("BULLET ARRAY LENGTH: " + bulletArray.length);
        }
    }

    characterBulletCollisionDetect() {
        for (let i = 0; i < monsterArray.length; i++) {
            if (this.currentLocation.x > monsterArray[i].model.hitBox.x && (this.currentLocation.x+this.width) < (monsterArray[i].model.hitBox.x+monsterArray[i].model.hitBox.width) && this.currentLocation.y > monsterArray[i].model.hitBox.y && (this.currentLocation.y+this.height/2) < (monsterArray[i].model.hitBox.y+monsterArray[i].model.hitBox.height)) {

                if (!this.dealtDamage.includes(monsterArray[i])) {
                    
                    monsterArray[i].takeDamage(this.damage);

                    if (SFXAllowed) {
                        document.getElementById("impactSE").volume = 0.5;
                        document.getElementById("impactSE").currentTime = 0;
                        document.getElementById("impactSE").play();
                    }
                    
                    if (monsterArray[i] != undefined) {
                        if (statusDMGMode == 1 && monsterArray[i].statusEffect.length > 0) {
                            monsterArray[i].takeDamage(Math.floor(this.damage/3));
                        }
                    }

                    if (lightning == 1) {
                        let lnStrike = new Skill(new Lightning(), new LightningModel(this.currentLocation.x));
                        if (SFXAllowed) {
                            document.getElementById("lightningStrike").play();
                        }
                    }

                    this.dealtDamage.push(monsterArray[i]);
                }

                if (piercing == 1) {
                    this.lifeTime -= 8;
                } else if (piercingGemBuff > 0 && Math.random < piercingGemBuff) {
                    this.lifeTime -= 8;
                } else {
                    this.lifeTime = -1;
                }

                if (stunMode == 1) {
                    if (Math.random() < 0.22) {
                        if (monsterArray[i] != undefined) {
                            monsterArray[i].takeStatusEffect(new Stun(30));
                        }
                    }
                }
            }
        }
    }
    
    
    monsterBulletCollisionDetect() {

        if (entityArray[0] !== undefined) {
            if (this.currentLocation.x > entityArray[0].model.hitBox.x && ((this.currentLocation.x+(this.width/2)) < (entityArray[0].model.hitBox.x+entityArray[0].model.hitBox.width)) && this.currentLocation.y > entityArray[0].model.hitBox.y && (this.currentLocation.y+(this.height/2)) < (entityArray[0].model.hitBox.y+entityArray[0].model.hitBox.height)) {
                //monsterArray[i].model.currentLocation.x -= 30;
                
                entityArray[0].takeDamage(this.damage);
                
                
                this.lifeTime = -1;
            }
        }
        

        if (this.type == 0 || this.type == 1) {
            if (this.currentLocation.x > currentCharacter.model.hitBox.x && ((this.currentLocation.x+(this.width/2)) < (currentCharacter.model.hitBox.x+currentCharacter.model.hitBox.width)) && this.currentLocation.y > currentCharacter.model.hitBox.y && (this.currentLocation.y+(this.height/2)) < (currentCharacter.model.hitBox.y+currentCharacter.model.hitBox.height)) {
                //monsterArray[i].model.currentLocation.x -= 30;
                currentCharacter.takeDamage(this.damage);
                
               // console.log("YOU GOT HIT LELE !\n");
                
                this.lifeTime = -1;
            }
        }

        if (this.type == 0 || this.type == 2) {
            if (this.currentLocation.x > currentBase.model.hitBox.x && ((this.currentLocation.x+(this.width/2)) < (currentBase.model.hitBox.x+currentBase.model.hitBox.width)) && this.currentLocation.y > currentBase.model.hitBox.y && (this.currentLocation.y+(this.height/2)) < (currentBase.model.hitBox.y+currentBase.model.hitBox.height)) {
                currentBase.takeDamage(this.damage);
                
                //console.log("BASE GOT HIT \n");
                
                this.lifeTime = -1;
            }
        }

    }
}

// runBullet() MUST ALWAYS BE THE LAST FUNCTION TO BE CALLED !
function moveBullet() {
    for (let i = 0; i < bulletArray.length; i++) {
            if (bulletArray[i] != undefined) {
                //console.log("Bullet " + bulletArray[i].id + " Life Time: " + bulletArray[i].lifeTime)
                //console.log(bulletArray[i].currentLocation.x + " " + bulletArray[i].currentLocation.y);
                //animationContext.fillStyle = "green";
                //animationContext.fillRect(bulletArray[i].currentLocation.x-(bulletArray[i].width/2), bulletArray[i].currentLocation.y-(bulletArray[i].height/2), bulletArray[i].width, bulletArray[i].height);
                animationContext.drawImage(bulletImage, bulletArray[i].currentLocation.x, bulletArray[i].currentLocation.y, bulletArray[i].width, bulletArray[i].height);
                bulletArray[i].runBullet();
        }
    }

    
    for (let j = 0; j < monsterBulletArray.length; j++) {
        if (monsterBulletArray[j] != undefined) {
            //console.log("Bullet " + bulletArray[i].id + " Life Time: " + bulletArray[i].lifeTime)
            //console.log(bulletArray[i].currentLocation.x + " " + bulletArray[i].currentLocation.y);
            //animationContext.fillStyle = "red";
            //animationContext.fillRect(monsterBulletArray[j].currentLocation.x-(monsterBulletArray[j].width/2), monsterBulletArray[j].currentLocation.y-(monsterBulletArray[j].height/2), monsterBulletArray[j].width, monsterBulletArray[j].height);
            
            animationContext.drawImage(enemyBulletImage, monsterBulletArray[j].currentLocation.x, monsterBulletArray[j].currentLocation.y, monsterBulletArray[j].width, monsterBulletArray[j].height);
            monsterBulletArray[j].runBullet();
        }
    }

    for (let k = 0; k < impactAnimationArray.length; k++) {
        impactAnimationArray[k].runAnimation();
    }
}