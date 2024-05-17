

var backgroundCanvas = document.getElementById("backgroundCV");
var bgContext = backgroundCanvas.getContext("2d");
bgContext.canvas.width = 1280;
bgContext.canvas.height = 720;

var backgroundIMG = new Image(1424, 448);
backgroundIMG.src = "./Image/background2.png";

var characterCanvas = document.getElementById("characterCV");
var chrContext = characterCanvas.getContext("2d");
chrContext.canvas.width = 1280;
chrContext.canvas.height = 720;

var animationCanvas = document.getElementById("animationCV");
var animationContext = animationCanvas.getContext("2d");
animationContext.canvas.width = 1280;
animationContext.canvas.height = 720;

var damageCalcCanvas = document.getElementById("damageCalcCV");
var dmgContext = damageCalcCanvas.getContext("2d");
dmgContext.canvas.width = 1280;
dmgContext.canvas.height = 720;
dmgContext.textAlign = "center";

var screenEffectCanvas = document.getElementById("screenEffectCV");
var screenContext = screenEffectCanvas.getContext("2d");
screenContext.canvas.width = 1280;
screenContext.canvas.height = 720;

//

let ceiling = 140;

let frameRate = 0;

let isMovingRight = false;
let isMovingLeft = false;
let isJumping = false;

let bulletFrameRate = 28; // Constant, don't touch.

let firing = true;

let usingSkill = false;
let skillInProgress = false;

let currentMouseX = 0;
let currentMouseY = 0;

let screenBounding = document.getElementById("animationCV").getBoundingClientRect();

let pause = true;
let gamePlaying = false;



/// MODIFIABLE PARAMETERS:

let gravity = 5; // Original: 5
let speed = originalSpeed; // Original: 8

let bulletDamage = playerOriginalATK;
let fireRate = originalFireRate;  // Original: 30 (Divides by Frame. 60/10 = 6 bullet per s)
let bulletSpeed = originalBulletSpeed; // Original: 15.
let bulletAmount = originalBulletAmount; // Maximum: 3, Original 1.

let damageModifier = 1;
let damageAddon = 0;
let sizeModifier = 1;
let magusMode = 0

let CDR = 0; // Cooldown reduction

let gemSkill = "";

let currentCooldown = [0, 0, 0, 0];

let growthNotice = false;

let speedDMGMode = 0;
let hpDMGMode = 0;

let URMode = 0;
let URSpawnChance = 0;

let amountGemBuff = 0;
let critGemBuff = 0;

let meleeMode = 0;

let sniperWeaponBuff = false;
let automaticShot = false;

let isTakingBuff = false;
/////////////////////////

let currLevel = 1;

function loadIcons() {
    for (let i = 0; i < 3; i++) {
        let skillIconID = "skill" + (i+1);
        document.getElementById(skillIconID).style.backgroundImage = "url('" + skillDataArray[skillArray[i]].src + "')";
    }

    if (skillArray[3] > -1) {
        document.getElementById("gemSkill").style.backgroundImage = "url('" + skillDataArray[skillArray[3]].src + "')";
    } else {
        document.getElementById("gemSkill").style.backgroundImage = "url('./Image/gemNotEquipped.png')";
    }

    document.getElementById("weapon_main").style.backgroundImage = "url('" + weaponDataArray[weaponArray[0]].src + "')";
}

function temporaryPause() {
    if (!isTakingBuff) {
        pause = true;
        document.getElementById("pauseScreen").style.display = "block";
    }
}

function returnToGame() {
    document.getElementById("pauseScreen").style.display = "none";
    pause = false;
    isMovingRight = false;
    isMovingLeft = false;
    usingSkill = false;
    checkGameState();
}

function surrender(){
    currentCharacter.hp = -1;
    
    document.getElementById("pauseScreen").style.display = "none";
    pause = false;

    isMovingRight = false;
    isMovingLeft = false;
    firing = false;
    usingSkill = false;
    checkGameState();

}

function resetPlayer() {
    currentCooldown = [1, 1, 1, 1];

    currLevel = 1;
    gravity = 5; // Original: 5
    speed = originalSpeed; // Original: 8

    bulletDamage = playerOriginalATK;
    fireRate = originalFireRate;  // Original: 30 (Divides by Frame. 60/10 = 6 bullet per s)
    bulletSpeed = originalBulletSpeed; // Original: 15.
    bulletAmount = originalBulletAmount; // Maximum: 3, Original 1.

    CDR = 0;

    damageModifer = 1;
    damageAddon = 0;
    sizeModifier = 1;

    piercing = 0;
    lightning = 0;
    stunMode = 0;

    speedDMGMode = 0;
    hpDMGMode = 0;
    statusDMGMode = 0;
    magusMode = 0;

    sniperWeaponBuff = false;
    fireRateCapSpeed = true;
    automaticShot = false;

    resetURBuff();
}

function runClock() {

    if (frameRate % 40 == 0) {
        if (gameClock > 0) {
            gameClock--;
        }
        if (gameClock > 120 && ((gameClock-1) % 60 == 0)) {
            if (SFXAllowed) {
                document.getElementById("battleMusic").volume = 0.05;
                setTimeout(()=> {
                    document.getElementById("battleMusic").volume = 0.5;
                }, 1000)
                document.getElementById("monsterStronger").volume = 1;
                document.getElementById("monsterStronger").play();
            }

            if (gameClock > 340) {
                TIME_MODIFIER += 0.25;
            } else {
                TIME_MODIFIER += 0.45;
            }
            
            if (spawnLimit > 26) {
                spawnLimit -= 15;
            } else if (spawnLimit > 12) {
                spawnLimit -= 11;
            }

            growthNotice = true;
            setTimeout(()=>{
                growthNotice = false;
            }, 2200);
        }

        if ((gameClock == 540) || (gameClock-1) % 120 == 0) {
            URSpawnChance = 1;
        }
    }

    screenContext.fillStyle = "white";

    screenContext.font = "bolder 36px Impact";
    let minutes = Math.floor(gameClock/60);
    let seconds = Math.floor(gameClock - 60*minutes);
    let secondPhrase = seconds;
    if (seconds < 10) {
        secondPhrase = "0"+seconds;
    }
    let text = "STAY ALIVE & PROTECT STATUE -  " + minutes + " : " + secondPhrase;
    screenContext.fillText(text, 380, 40, 500, 100);
    
};

// Monster Killed has already been defined in Characters.js

function levelUp() {

    if (gameClock > 1) {
    
        if (SFXAllowed) {
            document.getElementById("playerRankUp").volume = 1;
            document.getElementById("playerRankUp").play();
        }
        currLevel++;
        let levelUpAnimation = new ImpactAnimation(currentBase.model.hitBox.x-86, currentBase.model.hitBox.y-240, levelUpSprite, 13, 400, 600);
        levelUpAnimation.frameSpeed = 3;
        setTimeout(() => {
            pause = true;

            isTakingBuff = true;

            if (URMode > 0) {
                generateURBuff();
            } else {
                generateBuff();
            }
            document.getElementById("buffScreen").style.display = "block";
            document.getElementById("buffScreen").classList.remove("fadeOut");
            document.getElementById("buffScreen").classList.add("fadeIn");

            document.getElementById("buffStats").style.display = "block";
            document.getElementById("buffStats").classList.remove("fadeOut");
            document.getElementById("buffStats").classList.add("fadeIn");

            document.getElementById("resources").style.display = "none";
        }, 800);
    }  
}

function statsDisplay() {
    screenContext.fillStyle = "white";
    screenContext.font = "24px Impact";
    let nextLevel = 5*Math.ceil(currLevel/8);
    
    if (thisLevelKilled >= nextLevel) {
        thisLevelKilled = 0;
        levelUp();
    }
    let text = "MONSTERS KILL UNTIL NEXT BLESSING: " + thisLevelKilled + " / " + nextLevel;
    screenContext.fillText(text, 440, 70, 500, 100);

    document.getElementById("goldAmount").innerHTML = goldEarned;
    document.getElementById("diamondAmount").innerHTML = diamondEarned;
    document.getElementById("monsterKillAmount").innerHTML = monsterKilled;
}

function runCooldown() {
    if (frameRate % 48 == 0) {
        if (currentCooldown[0] > 0) {
            if (currentCooldown[0] - 1 > 0) {  
                document.getElementById("skill1").style.filter = "grayscale(0.8)";
                document.getElementById("skill1").innerHTML = currentCooldown[0]-1;
            } else {
                document.getElementById("skill1").style.filter = "grayscale(0)";
                document.getElementById("skill1").innerHTML = "";
            }
            currentCooldown[0] -= 1;
        }

        if (currentCooldown[1] > 0) {
            if (currentCooldown[1] - 1 > 0) {  
                document.getElementById("skill2").style.filter = "grayscale(0.8)";
                document.getElementById("skill2").innerHTML = currentCooldown[1]-1;
            } else {
                document.getElementById("skill2").style.filter = "grayscale(0)";
                document.getElementById("skill2").innerHTML = "";
            }
            currentCooldown[1] -= 1;
        }

        if (currentCooldown[2] > 0) {
            if (currentCooldown[2] - 1 > 0) {  
                document.getElementById("skill3").style.filter = "grayscale(0.8)";
                document.getElementById("skill3").innerHTML = currentCooldown[2]-1;
            } else {
                document.getElementById("skill3").style.filter = "grayscale(0)";
                document.getElementById("skill3").innerHTML = "";
            }
            currentCooldown[2] -= 1;
        }

        if (currentCooldown[3] > 0) {
            if (currentCooldown[3] - 1 > 0) {  
                document.getElementById("gemSkill").style.filter = "grayscale(0.8)";
                document.getElementById("gemSkill").innerHTML = currentCooldown[3]-1;
            } else {
                document.getElementById("gemSkill").style.filter = "grayscale(0)";
                document.getElementById("gemSkill").innerHTML = "";
            }
            currentCooldown[3] -= 1;
        }
    }
}


function checkState() {

    runClock();
    statsDisplay();

    if (isTakingDamage) {
        currentCharacter.model.changeSpriteState("hit")
    } else if (usingSkill) {
        currentCharacter.model.changeSpriteState("skill");
    } else if ((isMovingLeft || isMovingRight) && currentCharacter.model.currentLocation.y >= 0) {
        currentCharacter.model.changeSpriteState("run");
    } else if (isJumping && currentCharacter.model.currentLocation.y >= -ceiling) {
        currentCharacter.model.changeSpriteState("jump");
    } else if (currentCharacter.model.currentLocation.y >= 0) {
        currentCharacter.model.changeSpriteState("idle");
    }

    let speedAddon = speed*2;
    let hpAddon = currentCharacter.maxHP*0.07;
    if (bulletAmount > 1) {
        damageModifier = 0.7;
    } else {
        damageModifier = 1;
    }

    damageAddon = 0;

    if (speedDMGMode == 1) {
        damageAddon += speedAddon;
    }

    if (hpDMGMode == 1) {
        damageAddon += hpAddon;
    }

    if (critGemBuff > 0) {
        if (Math.random() < critGemBuff) {
            damageAddon += playerOriginalATK/3;
        }
    }


    //if (!isTakingDamage && !firing && !usingSkill && !isMovingRight && !isMovingLeft && currentCharacter.model.currentLocation.y >= 0) {
        //currentCharacter.model.changeSpriteState("idle");
    //}
        if (isMovingRight) {
            //if (currentCharacter.model.currentLocation.y >= 0 && //!firing && !usingSkill && !isTakingDamage) {
            //    currentCharacter.model.changeSpriteState("run");
            //}

            if (currentCharacter.model.currentLocation.x+currentCharacter.model.width >= 800 && camera.x < 704) {
                camera.x += speed/2;
            } else if (currentCharacter.model.width+currentCharacter.model.currentLocation.x < 1180) {
                currentCharacter.model.currentLocation.x+=speed;
            }
        }
        
        if (isMovingLeft) {
            //if (currentCharacter.model.currentLocation.y >= 0 && !firing && !usingSkill) {
            //    currentCharacter.model.changeSpriteState("run");
           // }

            if (currentCharacter.model.currentLocation.x+currentCharacter.model.width <= currentCharacter.model.width+250 && camera.x > 0) {
                camera.x -= speed/2;
            } else if (currentCharacter.model.width+currentCharacter.model.currentLocation.x > currentCharacter.model.width) {
                currentCharacter.model.currentLocation.x-=speed;
            }
        }

    if (isJumping && currentCharacter.model.currentLocation.y >= -ceiling) {
        //currentCharacter.model.changeSpriteState("jump");
        currentCharacter.model.currentLocation.y -= 30;
    } else if (currentCharacter.model.currentLocation.y < -ceiling) {
        isJumping = false;
    }

    if (currentCharacter.model.currentLocation.y < 0) {
        currentCharacter.model.currentLocation.y += gravity;
    }

    if (firing) {
        //if (!usingSkill && !isTakingDamage) {
            //currentCharacter.model.changeSpriteState("attack");
        //}
        if (bulletFrameRate % fireRate == 0) {
            if (SFXAllowed) {
                document.getElementById("bulletSoundSE").volume = 1;
                document.getElementById("bulletSoundSE").currentTime = 0;
                document.getElementById("bulletSoundSE").play();
            }
            for (let i = 0; i < bulletAmount; i++) {
                let bullet0 = new Bullet(Math.ceil((bulletDamage+damageAddon)*damageModifier), {x: currentCharacter.model.hitBox.x+currentCharacter.model.width/2, y: currentCharacter.model.hitBox.y+(currentCharacter.model.hitBox.height/2-30)+30*i}, {x: currentMouseX, y: currentMouseY}, 80, bulletSpeed, 32*sizeModifier, 32*sizeModifier, 0);

                if (amountGemBuff > 0) {
                    if(Math.random < amountGemBuff) {
                        let bullet1= new Bullet(Math.ceil((bulletDamage+damageAddon)*damageModifier), {x: currentCharacter.model.hitBox.x+currentCharacter.model.width/2, y: currentCharacter.model.hitBox.y+(currentCharacter.model.hitBox.height/2-30)+30*2}, {x: currentMouseX, y: currentMouseY}, 80, bulletSpeed, 32*sizeModifier, 32*sizeModifier, 0);
                    }
                }

                if (sniperWeaponBuff) {
                    setTimeout(() => {
                        let bullet0 = new Bullet(Math.ceil((bulletDamage+damageAddon)*damageModifier), {x: currentCharacter.model.hitBox.x+currentCharacter.model.width/2, y: currentCharacter.model.hitBox.y+(currentCharacter.model.hitBox.height/2-30)}, {x: currentMouseX, y: currentMouseY}, 80, bulletSpeed, 32*sizeModifier, 32*sizeModifier, 0);

                    }, 250);
                }
            }
        }
        animationContext.strokeStyle = "red";
        animationContext.lineWidth = 3;
    }

    if (automaticShot) {
        if (bulletFrameRate % weaponDataArray[weaponArray[0]].passiveFireRate == 0) {
            if (monsterArray.length > 0 && monsterArray[0] !== undefined) {
                let bullet0 = new Bullet(playerOriginalATK, {x: currentCharacter.model.hitBox.x+currentCharacter.model.width/2, y: currentCharacter.model.hitBox.y+(currentCharacter.model.hitBox.height/2-30)+30}, {x: monsterArray[0].model.hitBox.x, y: monsterArray[0].model.hitBox.y + monsterArray[0].model.hitBox.height/2}, 70, 10, 32, 32, 0);
            }
        }
    }

    //if (usingSkill) {
        //if (!isTakingDamage)
      //  currentCharacter.model.changeSpriteState("skill");
    //}

   // if (isTakingDamage) {
     //   currentCharacter.model.changeSpriteState("hit");
    //}
    

    moveBullet();
    processSkill();
    runCooldown();

    currentBase.model.updateBase();
    monsterAction();

    currentCharacter.updateCharacterState();
    checkPlayerState();
}

function draw() {
    //screenContext.clearRect(0, 0, screenEffectCanvas.width, screenEffectCanvas.height);
    //screenContext.fillStyle = "red";
    //screenContext.fillRect(0, 0, screenEffectCanvas.width, screenEffectCanvas.height);
    
    
    chrContext.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
    animationContext.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
    screenContext.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
    if (frameRate % 30 == 0) {
        dmgContext.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
    }

    frameRate++;
    bulletFrameRate++;

    if (gamePlaying) {
        checkState();
    }

    if (!pause) {
        requestAnimationFrame(draw);
    }

    screenBounding = document.getElementById("animationCV").getBoundingClientRect();


    bgContext.drawImage(backgroundIMG, camera.x, 0, 720, 448, 0, 0, 1280, 576);


    if (growthNotice) {
        screenContext.fillStyle = "red";
        screenContext.font = "bolder 36px Impact";
        let warning = "THE MONSTERS HAD GROWN STRONGER !";
        
        screenContext.fillText(warning, 440, 110, 400, 100);
        
    }
}

function checkGameState() {
    if (gamePlaying) {
        draw();
    }
}

function activateSkill(code) {

    let currentOnCastSkill = undefined;

    switch(code) {
        case 0:
            let newSkill0 = new Skill(new PiercingShot(), new PiercingShotModel());
            currentOnCastSkill = newSkill0;
            break;

        case 1:
            let newSkill1 = new Skill(new FlameArea(), new FlameAreaModel());
            currentOnCastSkill = newSkill1;
            break;

        case 2:
            let newSkill2 = new Skill(new Recovery(), new RecoveryModel());
            currentOnCastSkill = newSkill2;
            break;

        case 3:
            let newSkill3 = new Skill(new StunZone(), new StunZoneModel());
            currentOnCastSkill = newSkill3;
            break;
        
        case 4:
            let newSkill4 = new Skill(new Wall(), new WallModel());
            currentOnCastSkill = newSkill4;
            break;
        
        case 5:
            let newSkill5 = new Skill(new Explosion(), new ExplosionModel());
            currentOnCastSkill = newSkill5;
            break;
        
        case 6:
            let newSkill6 = new Skill(new MegaHeal(), new MegaHealModel());
            currentOnCastSkill = newSkill6;
            break;
        
        case 7:
            let newSkill7 = new Skill(new ExplosiveStun(), new ExplosiveStunModel());
            currentOnCastSkill = newSkill7;
            break;
        
        case 8:
            let newSkill8 = new Skill(new Smite(), new SmiteModel());
            currentOnCastSkill = newSkill8;
            break;
        
        case 9:
            let newSkill9 = new Skill(new PoisonGas(), new PoisonGasModel());
            currentOnCastSkill = newSkill9;
            break;
        
        case 10:
            let newSkill10 = new Skill(new DeflectiveWall(), new DeflectiveWallModel());
            currentOnCastSkill = newSkill10;
            break;
        
        case 11:
            let newSkill11 = new Skill(new Barrage(), new BarrageModel());
            currentOnCastSkill = newSkill11;
            break;
        
        case 12:
            let newSkill12 = new Skill(new DivineShield(), new DivineShieldModel());
            currentOnCastSkill = newSkill12;
            break;
        
        case 13:
            let newSkill13 = new Skill(new Nuke(), new NukeModel());
            currentOnCastSkill = newSkill13;
            break;

        // NOTE: CASE 14 is the Lightning Strike buff, so it will not be here.

        case 15:
            let newSkill15 = new Skill(new Rewind(), new RewindModel());
            currentOnCastSkill = newSkill15;
            break;

        case 16:
            let newSkill16 = new Skill(new Rage(fireRate, bulletSpeed), new RageModel());
            currentOnCastSkill = newSkill16;
            break;
        
        case 17:
            let newSkill17 = new Skill(new TimeStop(spawnLimit), new TimeStopModel());
            currentOnCastSkill = newSkill17;
            break;
    }

    return currentOnCastSkill;
}

function checkPlayerState() {

    if (currentCharacter.hp <= 0) {
        stopRoutine();
        displayEndgameStats();
        if (musicAllowed) {
            document.getElementById("gameDefeated").currentTime = 0;
            document.getElementById("gameDefeated").volume = 0.5;
            document.getElementById("gameDefeated").play();
        }

        document.getElementById("endScreen").style.background = "rgba(255, 0, 0, 0.7)";
        document.getElementById("declaration").innerHTML = "DEFEATED";
        document.getElementById("endScreen").classList.add("fadeIn");
        document.getElementById("endScreen").style.display = "block";

        //document.getElementById("gameScreen").style.classList.add("fadeOut");
        document.getElementById("gameScreen").style.display = "none";

        setTimeout (()=>{
            document.getElementById("endScreen").classList.remove("fadeIn");
        }, 190);

        
    } 

    if (currentBase.hp <= 0) {
        stopRoutine();
        displayEndgameStats();

        if (musicAllowed) {
            document.getElementById("gameDefeated").currentTime = 0;
            document.getElementById("gameDefeated").volume = 0.5;
            document.getElementById("gameDefeated").play();
        }

        document.getElementById("endScreen").style.background = "rgba(255, 0, 0, 0.7)";
        document.getElementById("declaration").innerHTML = "DEFEATED";
        document.getElementById("endScreen").style.display = "block";
        document.getElementById("endScreen").classList.add("fadeIn");

        //document.getElementById("gameScreen").style.classList.add("fadeOut");
        document.getElementById("gameScreen").style.display = "none";

        setTimeout (()=>{
            document.getElementById("endScreen").classList.remove("fadeIn");
        }, 190);
    }

    if (gameClock == 0) {
        stopRoutine();
        displayEndgameStats();

        if (musicAllowed) {
            document.getElementById("gameVictory").currentTime = 0;
            document.getElementById("gameVictory").volume = 0.5;
            document.getElementById("gameVictory").play();
        }

        document.getElementById("endScreen").style.backgroundImage = "url(./Image/Victory2.jpg)";
        document.getElementById("declaration").innerHTML = "VICTORY";
        document.getElementById("endScreen").classList.add("slowFadeIn");
        document.getElementById("endScreen").style.display = "block";

        //document.getElementById("gameScreen").style.classList.add("fadeOut");
        document.getElementById("gameScreen").style.display = "none";

        setTimeout (()=>{
            document.getElementById("endScreen").style.remove("slowFadeIn");
        }, 190);
    }


}

checkGameState();

function displayEndgameStats() {

    currMoney += goldEarned;
    currDiamond += diamondEarned;
    totalMonsterKilled += monsterKilled;

    saveGame();

    let survivalCount = 600 - gameClock;
    let minutes = Math.floor(survivalCount/60);
    let seconds = Math.floor(survivalCount-minutes*60);
    
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    let timeText = minutes + " : " + seconds;

    document.getElementById("survivalTime").innerHTML = timeText;

    document.getElementById("monsterKillCount").innerHTML = monsterKilled;
    document.getElementById("goldCount").innerHTML = goldEarned;
    document.getElementById("diamondCount").innerHTML = diamondEarned;

    checkShopReset();

    if (totalMonsterKilled > 200) {
        loadMonsterData();
    } else {
        document.getElementById("monsterToKill").innerHTML = 200 - totalMonsterKilled;
    }
}

function stopRoutine() {
    document.getElementById("battleMusic").pause();
    if (gamePlaying) {
        pause = true;
        gamePlaying = false;
        cancelAnimationFrame(draw);
        currentCharacter = undefined;
        bulletArray = [];
        monsterBulletArray = [];

        monsterArray = [];
        entityArray = [];
        skillAnimationArray = [];
        impactAnimationArray = [];

        noOfBullets = 0;
        camera.resetCamera();

        chrContext.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        animationContext.clearRect(0, 0, characterCanvas.width, characterCanvas.height);

        frameRate = -2;
        bulletFrameRate = 28;

        isMovingRight = false;
        isMovingLeft = false;
        firing = false;
        usingSkill = false;


        resetPlayer();
        checkGameState();
    }
}

function startRoutine() {
    
    if (!gamePlaying) {
        document.getElementById("endScreen").style.display = "none";
        resetPlayer();

        createCharacter()

        createBase();

        resetSpawnRate();
        
        evalGemstone();

        weaponDataArray[weaponArray[0]].ascend(); // Check weapon ascension.

        document.getElementById("gameScreen").style.display = "block";

        gamePlaying = true;
        pause = false;
        firing = true;

        loadIcons();
        loadSkillLevel();
        loadGemstoneLevel();

        loadSkillSounds();
        checkGameState();
    }
}

window.addEventListener("keydown", (event) => {

    if (gamePlaying && !pause) {
    switch (event.key){
        case "Escape":
            temporaryPause();
            break;

        case "d":
            isMovingRight = true;
            currentCharacter.model.facingDirection = 1;
            currentCharacter.frameRate = 0;
            currentCharacter.currentFrameIndex = 0;
            break;

        case "D":
            isMovingRight = true;
            currentCharacter.model.facingDirection = 1;                
            currentCharacter.frameRate = 0;
            currentCharacter.currentFrameIndex = 0;
            break;

        case "a":
            isMovingLeft = true;
            currentCharacter.model.facingDirection = 0;
            currentCharacter.frameRate = 0;
            currentCharacter.currentFrameIndex = 0;
            break; 

        case "A":
            isMovingLeft = true;
            currentCharacter.model.facingDirection = 0;
            currentCharacter.frameRate = 0;
            currentCharacter.currentFrameIndex = 0;
            break; 
        
        case "w":
                if (!isJumping && currentCharacter.model.currentLocation.y >= -1) {
                    isJumping = true;
                }
                
                break; 
        
        case "W":
            if (!isJumping && currentCharacter.model.currentLocation.y >= -1) {
                isJumping = true;
            }
                    
            break; 
        
        case " ":
            if (!isJumping && currentCharacter.model.currentLocation.y >= -1) {
                isJumping = true;
            }
            break;

        case "1":
            if (currentCooldown[0] == 0) {
                let returningSkill = activateSkill(skillArray[0]);

                if (SFXAllowed) {
                    document.getElementById("skill0Audio").play();
                }
                usingSkill = true;
                if (returningSkill !== undefined) {
                    if (magusMode > 0) {
                        CDR = returningSkill.data.cooldown/2;
                    }
                    currentCooldown[0] = Math.ceil(returningSkill.data.cooldown-CDR);
                    
                    document.getElementById("skill1").style.filter = "grayscale(0.8)";
                    document.getElementById("skill1").innerHTML = currentCooldown[0];
                }
            }
           
            break;

        case "2":
            if (currentCooldown[1] == 0) {
                let returningSkill = activateSkill(skillArray[1]);
                if (SFXAllowed) {
                    document.getElementById("skill1Audio").play();
                }

                usingSkill = true;
                if (returningSkill !== undefined) {
                    if (magusMode > 0) {
                        CDR = returningSkill.data.cooldown/2;
                    }
                    currentCooldown[1] = Math.ceil(returningSkill.data.cooldown-CDR);
                    document.getElementById("skill2").style.filter = "grayscale(0.8)";
                    document.getElementById("skill2").innerHTML = currentCooldown[1];
                    }
            }
           
            break;
        case "3":
            if (currentCooldown[2] == 0) {
                let returningSkill = activateSkill(skillArray[2]);
                if (SFXAllowed) {
                    document.getElementById("skill2Audio").play();
                }
                usingSkill = true;
                if (returningSkill !== undefined) {
                    if (magusMode > 0) {
                        CDR = returningSkill.data.cooldown/2;
                    }
                    currentCooldown[2] = Math.ceil(returningSkill.data.cooldown-CDR);
                    document.getElementById("skill3").style.filter = "grayscale(0.8)";
                    document.getElementById("skill3").innerHTML = currentCooldown[2];
                }
            }
           
            break;
        
        case "4":
            
            if (skillArray[3] > -1) {
                if (currentCooldown[3] == 0) {
                    let returningSkill = activateSkill(skillArray[3]);
                    if (SFXAllowed) {
                        document.getElementById("skill3Audio").play();
                    }
                    usingSkill = true;
                    if (returningSkill !== undefined) {
                        currentCooldown[3] = Math.ceil(returningSkill.data.cooldown);
                        document.getElementById("gemSkill").style.filter = "grayscale(0.8)";
                        document.getElementById("gemSkill").innerHTML = currentCooldown[3];
                    }
                }
            }
            break;
        
        // PRESS F to CHANGE GRAVITY (Irianne Skill)
        // PRESS G to SPEED UP
    }
}
});


window.addEventListener("keyup", (event) => {

    if (gamePlaying && !pause) {
    switch (event.key) {

    case "d":
        isMovingRight = false;
        break;

    case "D":
        isMovingRight = false;
        break;

    case "a":
        isMovingLeft = false;
        break;
    
    case "A":
        isMovingLeft = false;
        break;
        
    case "1":
        
        if (!skillInProgress) {
            skillInProgress = true;
            setTimeout(()=> {
                usingSkill = false;
                skillInProgress = false;
            }, 650);
        }
        break;
    case "2":
        if (!skillInProgress) {
            skillInProgress = true;
            setTimeout(()=> {
                usingSkill = false;
                skillInProgress = false;
            }, 650);
        }
        break;
    case "3":
        if (!skillInProgress) {
            skillInProgress = true;
            setTimeout(()=> {
                usingSkill = false;
                skillInProgress = false;
            }, 650);
        }
        break;
    case "4":
        break;
    }
}
});

window.addEventListener("mousemove", (event) => {
    if (gamePlaying) {
        currentMouseX = event.clientX - screenBounding.left;
        currentMouseY = event.clientY - screenBounding.top;
    }
});

/*
window.addEventListener("mousedown", (event) => {
    if (gamePlaying && !pause) {
        if ((bulletFrameRate / fireRate) > 1.5) {
            bulletFrameRate = fireRate-2;
        }
        firing = true;
        
    }
});


window.addEventListener("mouseup", (event) => {
    if (gamePlaying && !pause) {
        firing = false;
    }
});
*/