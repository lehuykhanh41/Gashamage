let chosenSkillIndex = -1;
let isGoingToGame = false;
let viewingSkill = true;
let viewingWeapon = false;
let viewingGemstone = false;

let activateFirstTime = true;

function activateGameFirstTime() {
    if (activateFirstTime) {
        goToScreen("titleScreen", "titleScreen");
        //document.getElementById("titleScreen").style.display = "block";
        activateFirstTime = false; 
        document.getElementById("firstMessage").classList = [];
        document.getElementById("firstMessage").style.display = "none";
        document.getElementById("titlePlaceHolder").style.display = "none";

        playTitleMusic();
    }
}

function playTitleMusic() {
    if (musicAllowed) {
        let audio = document.getElementById("titleMusic");
        audio.volume = 0.5;
        document.getElementById("titleMusic").play();
    }
}

function openSettingsMenu() {
    document.getElementById("settingTables").style.display="block";
    document.getElementById("backupCodeTables").style.display = "none";
}

function closeSettingsMenu() {
    document.getElementById("settingTables").style.display="none";
    document.getElementById("backupCodeTables").style.display = "none";
}

function openBackupMenu() {
    document.getElementById("backupCodeTables").style.display = "block";
    document.getElementById("settingTables").style.display="none";
}

function closeBackupMenu() {
    document.getElementById("backupCodeTables").style.display = "none";
}

function toggleVolume() {
    if (musicAllowed) {
        musicAllowed = false;
        document.getElementById("titleMusic").pause();
    }
    else {
        musicAllowed = true;
        playTitleMusic();
    }
}

function toggleSFX() {
    SFXAllowed = !SFXAllowed;
}

function updateItemBorder(storage, maxSize) {
    for (let i = 0; i < maxSize; i++) {
        let id ="sk" + i + "display";
        if (viewingWeapon) {
            id ="sk" + i + "displayWP";
        }

        
        if (storage.includes(i)) {
            document.getElementById(id).style.border = "3px solid lime";

        } else {
            document.getElementById(id).style.border = "";
        }
    }
}

function updateMoney() {
    document.getElementById("myGold").innerHTML = currMoney;
    document.getElementById("myDiamond").innerHTML = currDiamond;
    document.getElementById("myBlessing").innerHTML = currBlessing;

    document.getElementById("myGold2").innerHTML = currMoney;
    document.getElementById("myDiamond2").innerHTML = currDiamond;
    document.getElementById("myBlessing2").innerHTML = currBlessing;

    document.getElementById("myGold3").innerHTML = currMoney;
    document.getElementById("myDiamond3").innerHTML = currDiamond;
    document.getElementById("myBlessing3").innerHTML = currBlessing;
    
}

function updateSkill() {
    for (let i = 0; i < 14; i++) {
        let skillLoc = "sk" + i + "display";
        if (originalPlayerSkillLevel[i] > 0) {
            document.getElementById(skillLoc).style.backgroundImage = "url(./Skill_Icon/sk" + i + ".png)"; 
            updateItemBorder(skillArray, 14);
        }
        else {
            document.getElementById(skillLoc).style.backgroundImage = "url(./Skill_Icon/locked.png)";
        }
    }
}

function updateWeapon() {
    for (let i = 0; i < 4; i++) {
        let skillLoc = "sk" + i + "displayWP";
        if (originalPlayerWeaponLevel[i] > 0) {
            document.getElementById(skillLoc).style.backgroundImage = "url(./Weapon_Icon/WP" + i + ".png)"; 
            updateItemBorder(weaponArray, 4);
        }
        else {
            document.getElementById(skillLoc).style.backgroundImage = "url(./Skill_Icon/locked.png)";
        }
    }
}


function updateGemstone() {
    for (let i = 0; i < 14; i++) {
        let gemstoneLoc = "sk" + i + "display";
        if (originalPlayerGemstoneLevel[i] > 0) {
            document.getElementById(gemstoneLoc).style.backgroundImage = "url(./Gemstone_Icon/GS" + i + ".png)";
            updateItemBorder(gemstoneArray, 14);
        }
        else {
            document.getElementById(gemstoneLoc).style.backgroundImage = "url(./Skill_Icon/locked.png)";
            updateItemBorder(gemstoneArray, 14);
        }
    }
}

updateSkill();

function printNullSkill() {
    document.getElementById("skillScreenCardName").innerHTML = "??????";

            
    document.getElementById("skillScreenCardRarity").innerHTML = "LOCKED";
    document.getElementById("cardView").style.backgroundColor = "rgba(0, 0, 0, 0.8)";
           
        
        document.getElementById("skillScreenCardsrc").style.backgroundImage = "url('./Skill_Icon/locked.png')";
        document.getElementById("SKSClevel").innerHTML = "?";

        document.getElementById("currAmnt").innerHTML = "?";
        document.getElementById("nextLVAmnt").innerHTML = "?";
        document.getElementById("amountDizplay").style.width = 0;

        document.getElementById("skillScreenCardInfo").innerHTML = "CLICK AN ITEM TO VIEW ITS DETAILS";
        document.getElementById("skillScreenCardStats").style.display = "none";

        document.getElementById("chooseSlot").style.display = "none";
}

function printNullWeapon() {
    document.getElementById("weaponCardName").innerHTML = "??????";

    document.getElementById("cardView").style.backgroundColor = "rgba(0, 0, 0, 0.8)";
           
        
        document.getElementById("weaponCardsrc").style.backgroundImage = "url('./Skill_Icon/locked.png')";
        document.getElementById("WPlevel").innerHTML = "?";

        document.getElementById("weaponCardInfo").innerHTML = "CLICK AN ITEM TO VIEW ITS DETAILS";

        document.getElementById("weaponCardStats").style.display = "none"

        document.getElementById("upgradeWeaponButton").style.display = "none";
        document.getElementById("equipWeaponButton").style.display = "none";

        document.getElementById("weaponUniqueSkill").style.display = "none";

}


function displaySkillInScreen(index) {

    if (viewingSkill) {
        if (originalPlayerSkillLevel[index] > 0) {
            chosenSkillIndex = index;
            document.getElementById("skillScreenCardName").innerHTML = skillDataArray[index].name;

            if (skillDataArray[index].rarity == 0) {
                document.getElementById("skillScreenCardRarity").innerHTML = "COMMON";
                document.getElementById("cardView").style.backgroundColor = "rgba(0, 185, 0, 0.8)";
            } else if (skillDataArray[index].rarity == 1) {
                document.getElementById("skillScreenCardRarity").innerHTML = "RARE";
                document.getElementById("cardView").style.backgroundColor = "rgba(0, 0, 185, 0.8)";
            } else if (skillDataArray[index].rarity == 2) {
                document.getElementById("skillScreenCardRarity").innerHTML = "SUPER RARE";
                document.getElementById("cardView").style.backgroundColor = "rgba(180, 0, 220, 0.8)";
            } else if (skillDataArray[index].rarity == 3) {
                document.getElementById("skillScreenCardRarity").innerHTML = "LEGENDARY";
                document.getElementById("cardView").style.backgroundColor = "rgba(200, 0, 0, 0.8)";
            }
        
        document.getElementById("skillScreenCardsrc").style.backgroundImage = "url('" + skillDataArray[index].src + "')";
        document.getElementById("SKSClevel").innerHTML = originalPlayerSkillLevel[index];

        document.getElementById("currAmnt").innerHTML = originalCardAmount[index];
        if (originalPlayerSkillLevel[index] == 10) {
            document.getElementById("nextLVAmnt").innerHTML = "MAXED";
        } else {
        document.getElementById("nextLVAmnt").innerHTML = parseInt(2*originalPlayerSkillLevel[index]);
        }
        document.getElementById("amountDizplay").style.width = Math.min(96, Math.floor((100*originalCardAmount[index])/Math.pow(2, originalPlayerSkillLevel[index]))) + "%";

        document.getElementById("skillScreenCardInfo").innerHTML = skillDataArray[index].text;
        document.getElementById("skillScreenCardStats").style.display = "block";
        document.getElementById("SKSCcooldown").innerHTML = skillDataArray[index].cooldown;
        document.getElementById("SKSCeffectArea").innerHTML = skillDataArray[index].areaOfEffect;
        document.getElementById("equipSkillButton").style.display = "block";
        document.getElementById("equipSkillButton").innerHTML = "EQUIP";
        document.getElementById("equipSkillButton").style.background = "linear-gradient(#3AA346, #1E8C45, #007542, #1E9C35)";
        document.getElementById("chooseSlot").style.display = "none";;

        
            document.getElementById("eSlot1").style.border = "3px solid black";
            document.getElementById("eSlot2").style.border = "3px solid black";
            document.getElementById("eSlot3").style.border = "3px solid black";
        

        for (let i = 0; i < 3; i++) {
            if (skillArray[i] == index) {
                let slotID = "eSlot" + (i+1);
                document.getElementById("equipSkillButton").innerHTML = "EQUIPPED";
                document.getElementById("equipSkillButton").style.background = "grey";
                document.getElementById("atASlot").innerHTML = "AT SLOT:"
                document.getElementById("chooseSlot").style.display = "block";
                document.getElementById("eSlot1").style.backgroundImage = "url('" + skillDataArray[skillArray[0]].src + "')";
                document.getElementById("eSlot2").style.backgroundImage = "url('" + skillDataArray[skillArray[1]].src + "')";
                document.getElementById("eSlot3").style.backgroundImage = "url('" + skillDataArray[skillArray[2]].src + "')";
                document.getElementById(slotID).style.border = "2px solid gold";
                break;
            }
            }
        }
        else {
            document.getElementById("equipSkillButton").style.display = "none";
            printNullSkill();
        }
    }
    
    else if (viewingGemstone) {
        if (originalPlayerGemstoneLevel[index] > 0) {
            chosenSkillIndex = index;
            document.getElementById("skillScreenCardName").innerHTML = gemstoneDataArray[index].name;

            if (gemstoneDataArray[index].rarity == 0) {
                document.getElementById("skillScreenCardRarity").innerHTML = "COMMON";
                document.getElementById("cardView").style.backgroundColor = "rgba(0, 185, 0, 0.8)";
            } else if (gemstoneDataArray[index].rarity == 1) {
                document.getElementById("skillScreenCardRarity").innerHTML = "RARE";
                document.getElementById("cardView").style.backgroundColor = "rgba(0, 0, 185, 0.8)";
            } else if (gemstoneDataArray[index].rarity == 2) {
                document.getElementById("skillScreenCardRarity").innerHTML = "SUPER RARE";
                document.getElementById("cardView").style.backgroundColor = "rgba(180, 0, 220, 0.8)";
            } else if (gemstoneDataArray[index].rarity == 3) {
                document.getElementById("skillScreenCardRarity").innerHTML = "LEGENDARY";
                document.getElementById("cardView").style.backgroundColor = "rgba(200, 0, 0, 0.8)";
            }
        
        document.getElementById("skillScreenCardsrc").style.backgroundImage = "url('" + gemstoneDataArray[index].src + "')";
        document.getElementById("SKSClevel").innerHTML = originalPlayerGemstoneLevel[index];

        document.getElementById("currAmnt").innerHTML = originalGemstoneAmount[index];
        if (originalPlayerGemstoneLevel[index] == 10) {
            document.getElementById("nextLVAmnt").innerHTML = "MAXED";
        } else {
            document.getElementById("nextLVAmnt").innerHTML = parseInt(2*originalPlayerGemstoneLevel[index]);
        }
        document.getElementById("amountDizplay").style.width = Math.min(96, Math.floor((100*originalGemstoneAmount[index])/Math.pow(2, originalPlayerGemstoneLevel[index]))) + "%";

        document.getElementById("skillScreenCardInfo").innerHTML = gemstoneDataArray[index].text;
        document.getElementById("skillScreenCardStats").style.display = "none";
        document.getElementById("equipSkillButton").style.display = "block";
        document.getElementById("equipSkillButton").innerHTML = "EQUIP";
        document.getElementById("equipSkillButton").style.background = "linear-gradient(#3AA346, #1E8C45, #007542, #1E9C35)";
        document.getElementById("chooseSlot").style.display = "none";

        
            if (gemstoneArray[0] == index) {
                document.getElementById("equipSkillButton").innerHTML = "EQUIPPED";
                document.getElementById("equipSkillButton").style.background = "grey";
            }
        }
        else {
            printNullSkill();
            document.getElementById("equipSkillButton").style.display = "none";
        }
    }

}

let goldVal = 3000;

function displayWeaponInScreen(index) {
    chosenSkillIndex = index;
        if (originalPlayerWeaponLevel[index] > 0) {
            document.getElementById("unlockWeaponButton").style.display = "none";
            document.getElementById("weaponCardName").innerHTML = weaponDataArray[index].name;
        
        document.getElementById("weaponCardsrc").style.backgroundImage = "url('" + weaponDataArray[index].src + "')";
        document.getElementById("WPlevel").innerHTML = originalPlayerWeaponLevel[index];

        document.getElementById("weaponCardStats").style.display = "block";

        document.getElementById("wpATK").innerHTML = weaponDataArray[index].atk;
        document.getElementById("wpFR").innerHTML =  (60/weaponDataArray[index].fireRate).toFixed(1) + " bullets / seconds.";

        if (weaponDataArray[index].bulletSpeed > 24) {
            document.getElementById("wpBS").innerHTML = "Fast";
        } else if (weaponDataArray[index].bulletSpeed > 14) {
            document.getElementById("wpBS").innerHTML = "Normal";
        } else if (weaponDataArray[index].bulletSpeed > 5) {
            document.getElementById("wpBS").innerHTML = "Slow";
        }
        document.getElementById("wpAmnt").innerHTML = weaponDataArray[index].amount;
       

        document.getElementById("weaponCardInfo").innerHTML =  weaponDataArray[index].text;

        document.getElementById("equipWeaponButton").style.display = "block";

        document.getElementById("equipWeaponButton").innerHTML = "EQUIP";
        document.getElementById("equipWeaponButton").style.background = "linear-gradient(#3AA346, #1E8C45, #007542, #1E9C35)";
        
        document.getElementById("upgradeWeaponButton").style.display = "block";
        document.getElementById("upgradeWeaponButton").innerHTML = "UPGRADE<br> (🪙" + (2500 * originalPlayerWeaponLevel[index]) + ")";
        document.getElementById("upgradeWeaponButton").style.background = "linear-gradient(#3AA346, #1E8C45, #007542, #1E9C35)";

        document.getElementById("weaponUniqueSkill").style.display = "block";
        document.getElementById("WPSkillIcon").src =  weaponDataArray[index].src;
        document.getElementById("WPSkillName").innerHTML = weaponDataArray[index].skillName;
        document.getElementById("WPSkillData").innerHTML = weaponDataArray[index].skillText;

        if (originalPlayerWeaponLevel[index] < weaponDataArray[index].skillUnlockLevel) {
            document.getElementById("wpSkillLocked").style.display = "block";
            document.getElementById("wpSkillUnlockLevel").innerHTML = weaponDataArray[index].skillUnlockLevel;
        } else {
            document.getElementById("wpSkillLocked").style.display = "none";
        }

        if (weaponArray[0] == index) {
            document.getElementById("equipWeaponButton").innerHTML = "EQUIPPED";
            document.getElementById("equipWeaponButton").style.background = "grey";
        }

        if (originalPlayerWeaponLevel[index] == 10) {
            document.getElementById("upgradeWeaponButton").innerHTML = "MAXED";
            document.getElementById("upgradeWeaponButton").style.background = "red";
        }
        } else {
            printNullWeapon();
            document.getElementById("weaponCardName").innerHTML = weaponDataArray[index].name;
            document.getElementById("equipWeaponButton").style.display = "none";
            document.getElementById("upgradeWeaponButton").style.display = "none";
            document.getElementById("unlockWeaponButton").style.display = "block";
            document.getElementById("unlockWeaponButton").innerHTML = "UNLOCK<br> (🪙" + goldVal + ")";

        }
}

function equipWeapon() {
    if (viewingWeapon) {
        weaponArray[0] = chosenSkillIndex;
        displayWeaponInScreen(chosenSkillIndex);
        updateItemBorder(weaponArray, 4);
        bulletImage.src = "./Bullet/Bullet" + chosenSkillIndex + ".png";
        document.getElementById("equipSound").currentTime = 0;
        document.getElementById("equipSound").play();
        evalWeaponEquip();

        saveGame();
    }
}

function upgradeWeapon() {
    if (viewingWeapon) {
        if (currMoney >= originalPlayerWeaponLevel[chosenSkillIndex]*2500 && originalPlayerWeaponLevel[chosenSkillIndex]<10) {
            currMoney -=  originalPlayerWeaponLevel[chosenSkillIndex]*2500;
            originalPlayerWeaponLevel[chosenSkillIndex]+=1;

            weaponDataArray[chosenSkillIndex].levelUp(Math.floor(weaponDataArray[chosenSkillIndex].atk/10));
            document.getElementById("playerRankUp").currentTime = 0;
            document.getElementById("playerRankUp").play();

            displayWeaponInScreen(chosenSkillIndex);
            updateMoney();

            saveGame();
            evalWeaponEquip();
        }
    }
 }

 function unlockWeapon() {
    if (viewingWeapon) {
        if (currMoney >= goldVal && originalPlayerWeaponLevel[chosenSkillIndex]==0) {
            currMoney -= goldVal;
            originalPlayerWeaponLevel[chosenSkillIndex] += 1;
            document.getElementById("playerRankUp").currentTime = 0;
            document.getElementById("playerRankUp").play();
            updateMoney();
            updateWeapon();
            saveGame();
            displayWeaponInScreen(chosenSkillIndex);
            for (let s = 1 ; s < 4; s++) {
                if (originalPlayerWeaponLevel[s] > 0) {
                    goldVal += 2000;
                }
            }
        } else {
            document.getElementById("generalNotice").innerHTML = "<br>NOT ENOUGH 🪙 GOLD.";
            document.getElementById("generalNotice").style.display = "block";
    
            setTimeout(()=> {
                document.getElementById("generalNotice").style.display = "none";
            }, 1200);
        }
    }
 }

 function evalWeaponEquip() {
    playerOriginalATK = weaponDataArray[weaponArray[0]].atk;
    originalFireRate = weaponDataArray[weaponArray[0]].fireRate;
    originalBulletSpeed = weaponDataArray[weaponArray[0]].bulletSpeed;
    originalBulletAmount = weaponDataArray[weaponArray[0]].amount;
 }

function showSkillSlot() {
    if (viewingSkill) {
        document.getElementById("atASlot").innerHTML = "CHOOSE A SLOT:"
        document.getElementById("chooseSlot").style.display = "block";
        document.getElementById("eSlot1").style.backgroundImage = "url('" + skillDataArray[skillArray[0]].src + "')";
        document.getElementById("eSlot2").style.backgroundImage = "url('" + skillDataArray[skillArray[1]].src + "')";
        document.getElementById("eSlot3").style.backgroundImage = "url('" + skillDataArray[skillArray[2]].src + "')";
    } else if (viewingGemstone) {
        equipGemstone(chosenSkillIndex);
    }
}

function equipSkill(index) {
    if (skillArray.includes(chosenSkillIndex)) {
        for (let i = 0; i < 3; i++){
            if (skillArray[i] == chosenSkillIndex) {
                skillArray[i] = skillArray[index];
                break;
            }
        }
    }
    skillArray[index] = chosenSkillIndex;

    displaySkillInScreen(chosenSkillIndex);

    document.getElementById("equipSound").currentTime = 0;
    document.getElementById("equipSound").play();

    updateItemBorder(skillArray, 14);

    saveGame();
}

function equipGemstone(index) {

    gemstoneArray[0] = index;
    saveGame();

    displaySkillInScreen(chosenSkillIndex);

    document.getElementById("equipSound").currentTime = 0;
    document.getElementById("equipSound").play();

    updateItemBorder(gemstoneArray, 14);

    evalGemstone();

}


function resetGemBuff() {
    amountGemBuff = 0;
    piercingGemBuff = 0;
    critGemBuff = 0;
    goldEarnBuff = 1;
    diamondEarnBuff = 0;
    diamondGemBuff = 0;
    statueRecoveryGem = 0;
}

function evalGemstone() {

    resetGemBuff();

    if (gemstoneArray[0] > 9) {
        gemstoneDataArray[gemstoneArray[0]].applyGem();
        skillArray[3] = gemstoneArray[0]+5;
    }
    else if (gemstoneArray[0] > -1) {
        gemstoneDataArray[gemstoneArray[0]].applyGem();
        skillArray[3] = -1;
    }
}

function startGameFromSkillScreen() {
    document.getElementById("skillScreen").classList.add("slowFadeOut");
    document.getElementById("titleMusic").pause();
    
    setTimeout(()=>{
        document.getElementById("skillScreen").style.display = "none";
        document.getElementById("skillScreen").classList.remove("slowFadeOut");

        document.getElementById("gameScreen").classList.add("fadeIn");
        document.getElementById("gameScreen").style.display = "block";


    }, 990);

    setTimeout(()=> {
        document.getElementById("gameScreen").classList.remove("fadeIn");
        startRoutine();
        if (musicAllowed) {
            document.getElementById("battleMusic").volume = 0.5;
            document.getElementById("battleMusic").currentTime = 0;
            document.getElementById("battleMusic").play();
        }
    }, 1100);
}


function goToScreen(currentScreen, destinationScreen) {
    closeSettingsMenu();
    
    if (destinationScreen != 'skillScreen') {
        isGoingToGame = false;
    }

    if (currentScreen == "endScreen" && destinationScreen == "titleScreen") {
        document.getElementById("gameVictory").pause();
        document.getElementById("gameDefeated").pause();
        playTitleMusic();
    }

    document.getElementById(currentScreen).style.display = "none";
    document.getElementById(currentScreen).classList.add("fadeOut");
    
    document.getElementById(destinationScreen).style.display = "block";
    document.getElementById(destinationScreen).classList.add("slowFadeIn");

    setTimeout(()=>{
        document.getElementById(currentScreen).classList.remove("fadeOut");
        document.getElementById(destinationScreen).classList.remove("slowFadeIn");
    },990);

    if (destinationScreen == "skillScreen") {
        updateMoney();
        viewSkillsMenu();
        if (isGoingToGame) {
            document.getElementById("startGameFromSkillScreenBTN").style.display = "block";
            document.getElementById("moneyAndDiamonds").style.display = "none";
        } else {
            document.getElementById("moneyAndDiamonds").style.display = "block";
            document.getElementById("startGameFromSkillScreenBTN").style.display = "none";
        }
    } else if (destinationScreen == "shopScreen") {
        updateMoney();
        if (!firstTimeGenerated) {
            generateShopItem();
        }
        firstTimeGenerated = true;
    }
}

function activateGameScreenThroughSkillScreen() {
    isGoingToGame = true;
    goToScreen('titleScreen', 'skillScreen');
}   


function viewSkillsMenu() {
    viewingWeapon = false;
    updateSkill();
    printNullSkill();
    document.getElementById("storage").style.border = "3px solid gold";
    document.getElementById("skillCardDizplay").style.display = "block";
    document.getElementById("weaponCardDizplay").style.display = "none";
    document.getElementById("skillTable").style.display = "block";
    document.getElementById("weaponTable").style.display = "none";
    viewingSkill = true;
    viewingGemstone = false;
}

function viewWeaponsMenu() {
    viewingWeapon = true;
    updateWeapon();
    printNullWeapon();
    document.getElementById("storage").style.border = "3px solid red";
    document.getElementById("weaponCardDizplay").style.display = "block";
    document.getElementById("skillCardDizplay").style.display = "none";
    document.getElementById("weaponTable").style.display = "block";
    document.getElementById("skillTable").style.display = "none";
    viewingSkill = false;
    viewingGemstone = false;
}


function viewGemstonesMenu() {
    viewingWeapon = false;
    updateGemstone();
    printNullSkill();
    document.getElementById("storage").style.border = "3.5px solid green";
    document.getElementById("skillCardDizplay").style.display = "block";
    document.getElementById("skillTable").style.display = "block";
    document.getElementById("weaponCardDizplay").style.display = "none";
    document.getElementById("weaponTable").style.display = "none";
    viewingGemstone = true;
    viewingSkill = false;
}

function playHoverSound() {
    if (SFXAllowed) {
        let hoverSound = document.getElementById("buttonOnHover");
        hoverSound.currentTime = 0.2;
        hoverSound.play();
    }
}

function loadSkillSounds() {
    for (let i = 0; i < 4; i++) {
        if (skillArray[i] > -1) {
            document.getElementById("skill" + i + "Audio").src = skillDataArray[skillArray[i]].audioSRC;
        }
    }
}