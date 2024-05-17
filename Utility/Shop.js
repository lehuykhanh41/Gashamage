let unlockedSkillRare = false;
let unlockedSkillSR = false;
let unlockedSkillUR = false;

let unlockedGemRare = false;
let unlockedGemSR = false;
let unlockedGemUR = false;

let firstTimeGenerated = false;

let itemArray = [];

let gamesTillShopReset = 5;

let bannerArray= [];
let currentBannerIndex = 0;

class gachaBanner {
    constructor(id, type) {
        this.id = id;
        this.src = "";
        this.type = type; // 0 for skills, 1 for gemstones.
        this.featuredItems = [];
        bannerArray.push(this);
    }
}

class ShopItem {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        if (type == 0) {// Skill
            this.name = skillDataArray[id].name;
            this.src = skillDataArray[id].src;
            this.rarity = skillDataArray[id].rarity;
        } else if (type == 1) {
            this.name = gemstoneDataArray[id].name;
            this.src = gemstoneDataArray[id].src;
            this.rarity = gemstoneDataArray[id].rarity;
        } else if (type == 2) {
            this.name = "";
            this.src = "";
            this.rarity = 1;
        }

        if (this.rarity == 0) {
            this.cost = 600;
            this.border = "green";
          
        } else if (this.rarity == 1) {
            this.cost = 1200;
            this.border = "#0096C7";
         
        } else if (this.rarity == 2) {
            this.cost = 2000;
            this.border = "purple";
         
        } else {
            this.cost = 5000;
            this.border = "red";
        }
        if (this.rarity == 3) {
            this.remaining = 1;
        } else {
            this.remaining = 3;
        }
        itemArray.push(this);
    }

    purchase() {
        if (this.type == 0) {
            originalCardAmount[this.id] += 1;
            this.remaining--;
        } else if (this.type == 1) {
            originalGemstoneAmount[this.id] += 1;
            this.remaining--;
        } else if (this.type == 2) {
            this.remaining--;
            if (this.id == 1000) {
                currMoney += 500;
                updateMoney();
            } else if (this.id == 1100) {
                currDiamond += 1;
                updateMoney();
            } else if (this.id == 1200) {
                currDiamond += 10;
                updateMoney();
            }
        }
    }
}

let generatedSkills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let generatedGemstone = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function generateShopItem() {
    itemArray = [];
    generateWeaponItems();
    generateGemstoneItems();
    generateLastRowItem();
    evalPurchase(-1, 2)
}

function generateWeaponItems() {
    if (!unlockedSkillRare) {
        for (let i = 0; i < 3; i++) {
        let skillResult = Math.floor(Math.random()*6);
            while (generatedSkills[skillResult] > 0) {
                skillResult = Math.floor(Math.random()*6);
            }
        generatedSkills[skillResult] = 1;
        let newSkillItem = new ShopItem(skillResult, 0);

        document.getElementById("shop" + i + "Name").innerHTML = newSkillItem.name;
        document.getElementById("shop" + i + "Img").src = newSkillItem.src;
        document.getElementById("shop" + i + "Cost").innerHTML = newSkillItem.cost;
        document.getElementById("shop" + i + "Remaining").innerHTML = newSkillItem.remaining;
        document.getElementById("shop" + i + "display").style.border = "4px solid " + newSkillItem.border;
        document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newSkillItem.border;
        }

    } else if (!unlockedSkillSR) {
        for (let i = 0; i < 3; i++) {
            let skillResult = Math.floor(Math.random()*4 + 6);
            if (Math.random() < 0.3) {
                skillResult = Math.floor(Math.random()*4 + 6);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*4 + 6);
                }
            } else {
                skillResult = Math.floor(Math.random()*6);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*6);
                }
            }
            generatedSkills[skillResult] = 1;
            let newSkillItem = new ShopItem(skillResult, 0);
    
            document.getElementById("shop" + i + "Name").innerHTML = newSkillItem.name;
            document.getElementById("shop" + i + "Img").src = newSkillItem.src;
            document.getElementById("shop" + i + "Cost").innerHTML = newSkillItem.cost;
            document.getElementById("shop" + i + "Remaining").innerHTML = newSkillItem.remaining;
            document.getElementById("shop" + i + "display").style.border = "4px solid " + newSkillItem.border;
            document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newSkillItem.border;
        }
    } else if (!unlockedSkillUR) {

        for (let i = 0; i < 3; i++) {
            let skillResult = Math.floor(Math.random()*4 + 6);
            if (Math.random() < 0.15) {
                skillResult = Math.floor(Math.random()*2 + 10);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*2 + 10);
                }
            } else if (Math.random() < 0.45) {
                skillResult = Math.floor(Math.random()*4 + 6);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*4 + 6);
                }
            } else {
                skillResult = Math.floor(Math.random()*6);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*6);
                }
            }
            generatedSkills[skillResult] = 1;
            let newSkillItem = new ShopItem(skillResult, 0);
    
            document.getElementById("shop" + i + "Name").innerHTML = newSkillItem.name;
            document.getElementById("shop" + i + "Img").src = newSkillItem.src;
            document.getElementById("shop" + i + "Cost").innerHTML = newSkillItem.cost;
            document.getElementById("shop" + i + "Remaining").innerHTML = newSkillItem.remaining;
            document.getElementById("shop" + i + "display").style.border = "4px solid " + newSkillItem.border;
            document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newSkillItem.border;
        }
    } else {
        for (let i = 0; i < 3; i++) {
            let skillResult = Math.floor(Math.random()*4 + 6);
            if (Math.random() < 0.05) {
                skillResult = Math.floor(Math.random()*2 + 12);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*2 + 12);
                }
            }
            else if (Math.random() < 0.15) {
                skillResult = Math.floor(Math.random()*2 + 10);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*4 + 6);
                }
            } else if (Math.random() < 0.45) {
                skillResult = Math.floor(Math.random()*4 + 6);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*4 + 6);
                }
            } else {
                skillResult = Math.floor(Math.random()*6);
                while (generatedSkills[skillResult] > 0) {
                    skillResult = Math.floor(Math.random()*6);
                }
            }
            generatedSkills[skillResult] = 1;
            let newSkillItem = new ShopItem(skillResult, 0);
    
            document.getElementById("shop" + i + "Name").innerHTML = newSkillItem.name;
            document.getElementById("shop" + i + "Img").src = newSkillItem.src;
            document.getElementById("shop" + i + "Cost").innerHTML = newSkillItem.cost;
            document.getElementById("shop" + i + "Remaining").innerHTML = newSkillItem.remaining;
            document.getElementById("shop" + i + "display").style.border = "4px solid " + newSkillItem.border;
            document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newSkillItem.border;
        }
    }


    generatedSkills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function generateGemstoneItems() {
    if (!unlockedGemRare) {
        for (let i = 3; i < 6; i++) {
        let gemResult = Math.floor(Math.random()*4);
            while (generatedGemstone[gemResult] > 0) {
                gemResult = Math.floor(Math.random()*4);
            }
        generatedGemstone[gemResult] = 1;
        let newGemItem = new ShopItem(gemResult, 1);

        document.getElementById("shop" + i + "Name").innerHTML = newGemItem.name;
        document.getElementById("shop" + i + "Img").src = newGemItem.src;
        document.getElementById("shop" + i + "Cost").innerHTML = newGemItem.cost;
        document.getElementById("shop" + i + "Remaining").innerHTML = newGemItem.remaining;
        document.getElementById("shop" + i + "display").style.border = "4px solid " + newGemItem.border;
        document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newGemItem.border;
        }

    } else if (!unlockedGemSR) {
        for (let i = 3; i < 6; i++) {
            let gemResult = Math.floor(Math.random()*4 + 4);
            if (Math.random() < 0.3) {
                gemResult = Math.floor(Math.random()*4 + 4);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*4 + 4);
                }
            } else {
                gemResult = Math.floor(Math.random()*4);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*4);
                }
            }
            generatedGemstone[gemResult] = 1;
            let newGemItem = new ShopItem(gemResult, 1);
    
            document.getElementById("shop" + i + "Name").innerHTML = newGemItem.name;
            document.getElementById("shop" + i + "Img").src = newGemItem.src;
            document.getElementById("shop" + i + "Cost").innerHTML = newGemItem.cost;
            document.getElementById("shop" + i + "Remaining").innerHTML = newGemItem.remaining;
            document.getElementById("shop" + i + "display").style.border = "4px solid " + newGemItem.border;
            document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newGemItem.border;
        }
    } else if (!unlockedGemUR) {

        for (let i = 3; i < 6; i++) {
            let gemResult = Math.floor(Math.random()*4 + 6);
            if (Math.random() < 0.15) {
                gemResult = Math.floor(Math.random()*3 + 8);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*3 + 8);
                }
            } else if (Math.random() < 0.45) {
                gemResult = Math.floor(Math.random()*4 + 4);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*4 + 4);
                }
            } else {
                gemResult = Math.floor(Math.random()*4);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*4);
                }
            }
            generatedGemstone[gemResult] = 1;
            let newGemItem = new ShopItem(gemResult, 1);
    
            document.getElementById("shop" + i + "Name").innerHTML = newGemItem.name;
            document.getElementById("shop" + i + "Img").src = newGemItem.src;
            document.getElementById("shop" + i + "Cost").innerHTML = newGemItem.cost;
            document.getElementById("shop" + i + "Remaining").innerHTML = newGemItem.remaining;
            document.getElementById("shop" + i + "display").style.border = "4px solid " + newGemItem.border;
            document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newGemItem.border;
        }
    } else {
        for (let i = 3; i < 6; i++) {
            let gemResult = Math.floor(Math.random()*4 + 6);
            if (Math.random() < 0.05) {
                gemResult = Math.floor(Math.random()*2 + 11); // NO REAPER YET
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*2 + 11); // NO REAPTER YET
                }
            }
            else if (Math.random() < 0.15) {
                gemResult = Math.floor(Math.random()*3 + 8);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*3 + 8);
                }
            } else if (Math.random() < 0.45) {
                gemResult = Math.floor(Math.random()*4 + 4);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*4 + 4);
                }
            } else {
                gemResult = Math.floor(Math.random()*4);
                while (generatedGemstone[gemResult] > 0) {
                    gemResult = Math.floor(Math.random()*4);
                }
            }
            generatedGemstone[gemResult] = 1;
            let newGemItem = new ShopItem(gemResult, 1);
    
            document.getElementById("shop" + i + "Name").innerHTML = newGemItem.name;
            document.getElementById("shop" + i + "Img").src = newGemItem.src;
            document.getElementById("shop" + i + "Cost").innerHTML = newGemItem.cost;
            document.getElementById("shop" + i + "Remaining").innerHTML = newGemItem.remaining;
            document.getElementById("shop" + i + "display").style.border = "4px solid " + newGemItem.border;
            document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 5px " + newGemItem.border;
        }
    }


    generatedGemstone = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function generateLastRowItem() {
    for (let i = 6; i < 9; i++) {
        let newGemItem = new ShopItem(6, 2);

        if (i == 6) {
            newGemItem.id = 1000;
            newGemItem.name = "500 COINS";
            newGemItem.src = "./Image/coinItem.png";
            newGemItem.cost = 1;
            newGemItem.remaining = 1000;
        } else if (i == 7) {
            newGemItem.id = 1100;
            newGemItem.name = "1 DIAMOND";
            newGemItem.src = "./Image/diamondItem.png";
            newGemItem.cost = 5;
            newGemItem.remaining = 1000;
        } else if (i == 8) {
            newGemItem.id = 1200;
            newGemItem.name = "10 DIAMOND";
            newGemItem.src = "./Image/diamondBagItem.png";
            newGemItem.cost = 45;
            newGemItem.remaining = 1000;
        }

        document.getElementById("shop" + i + "Name").innerHTML = newGemItem.name;
        document.getElementById("shop" + i + "Img").src = newGemItem.src;
        document.getElementById("shop" + i + "Cost").innerHTML = newGemItem.cost;
        document.getElementById("shop" + i + "Remaining").innerHTML = newGemItem.remaining;
        document.getElementById("shop" + i + "display").style.border = "4px solid gold";
        document.getElementById("shop" + i + "display").style.boxShadow = "0px 0px 10px 2px gold";
        }
}

let currentlySelectedItemIndex = -1;

function purchase(index) {
    if (itemArray[index].remaining > 0) {
        document.getElementById("purchaseConfirm").innerHTML = "CONFIRM";
        document.getElementById("confirmPurchase").style.display = "block";
        document.getElementById("confirmPurchase").classList.add("fadeIn");
        document.getElementById("itemToBePurchased").innerHTML = itemArray[index].name;
        document.getElementById("itemToBePurchased").style.color = itemArray[index].border;
        
        if (index < 6) {
            document.getElementById("itemToBePurchasedCost").innerHTML = "🪙" + itemArray[index].cost;
        } else {
            document.getElementById("itemToBePurchasedCost").innerHTML = "☘️" + itemArray[index].cost;
        }
    }

    currentlySelectedItemIndex = index;
}



function confirmPurchase() {
    if (currentlySelectedItemIndex < 6) {
        if (currMoney >= itemArray[currentlySelectedItemIndex].cost) {
            currMoney -= itemArray[currentlySelectedItemIndex].cost;
            itemArray[currentlySelectedItemIndex].purchase();
            document.getElementById("shop" + currentlySelectedItemIndex + "Remaining").innerHTML = itemArray[currentlySelectedItemIndex].remaining;
            updateMoney();

            document.getElementById("purchaseConfirm").innerHTML = "SUCCESSFULL";
            if (currentlySelectedItemIndex < 3) {
                evalPurchase(itemArray[currentlySelectedItemIndex].id, 0);
            } else if (currentlySelectedItemIndex < 6) {
                evalPurchase(itemArray[currentlySelectedItemIndex].id, 1);
            }

        } else {
            document.getElementById("purchaseConfirm").innerHTML = "NOT ENOUGH MONEY";
        }
    } else {
        if (currBlessing >= itemArray[currentlySelectedItemIndex].cost) {
            currBlessing -= itemArray[currentlySelectedItemIndex].cost;
            itemArray[currentlySelectedItemIndex].purchase();
            document.getElementById("shop" + currentlySelectedItemIndex + "Remaining").innerHTML = itemArray[currentlySelectedItemIndex].remaining;
            updateMoney();

            document.getElementById("purchaseConfirm").innerHTML = "SUCCESSFUL";
            evalPurchase()

        } else {
            document.getElementById("purchaseConfirm").innerHTML = "NOT ENOUGH MONEY";
        }
    }


    setTimeout(()=>{
        document.getElementById("confirmPurchase").style.display = "none";
        document.getElementById("confirmPurchase").classList.remove("fadeIn");
    }, 700);
}

function cancelPurchase() {
    document.getElementById("confirmPurchase").classList.remove("fadeIn");
    document.getElementById("confirmPurchase").classList.add("fadeOut");
    setTimeout(()=>{
        document.getElementById("confirmPurchase").style.display = "none";
        document.getElementById("confirmPurchase").classList.remove("fadeOut");
    }, 190);
}

function evalPurchase(index, type) {
    for (let i = 0; i < 9; i++) {
        if (itemArray[i].remaining == 0) {
            document.getElementById("shop" + i + "Img").style.filter = "grayscale(1.0)";
            document.getElementById("shop" + i + "Cost").innerHTML = "SOLD OUT";
            document.getElementById("shop" + i + "Remaining").innerHTML = "N/A";
        } else {
            document.getElementById("shop" + i + "Img").style.filter = "grayscale(0)";
        }
    }

    saveGame();

    if (type == 0) {
        checkCardLevelUp(index);
    } else if (type == 1) {
        checkGemLevelUp(index);
    }

}

function checkCardLevelUp(index) {
    if (originalPlayerSkillLevel[index] < 10) {
    if (originalCardAmount[index] >= (2*originalPlayerSkillLevel[index])) {
        
        originalCardAmount[index] -= (2*originalPlayerSkillLevel[index]);
        originalPlayerSkillLevel[index]++;
        skillDataArray[index].level++;
        skillDataArray[index].updateValue();

        saveGame();

        if (SFXAllowed) {
            document.getElementById("playerRankUp").currentTime = 0;
            document.getElementById("playerRankUp").play();
        }

        if (originalPlayerSkillLevel[index] == 1) {
            document.getElementById("unlockedCardName").innerHTML = skillDataArray[index].name;
            document.getElementById("unlockedCardSRC").src = skillDataArray[index].src;
            document.getElementById("unlockNotice").classList.add("fadeIn");
            document.getElementById("unlockNotice").style.display = "block";
        }

        else {
            document.getElementById("leveledUpCardName").innerHTML = skillDataArray[index].name;
            document.getElementById("leveledUpCardLevel").innerHTML = skillDataArray[index].level;
            document.getElementById("leveledUpCardSRC").src = skillDataArray[index].src;
            document.getElementById("levelUpNotice").classList.add("fadeIn");
            document.getElementById("levelUpNotice").style.display = "block";
        }

        setTimeout(()=> {
            document.getElementById("levelUpNotice").classList.remove("fadeIn");
            document.getElementById("levelUpNotice").style.display = "none";

            document.getElementById("unlockNotice").classList.remove("fadeIn");
            document.getElementById("unlockNotice").style.display = "none";
        }, 1200);
    } 
    } else {
        currBlessing += Math.pow(3,skillDataArray[index].rarity);
        document.getElementById("generalNotice").innerHTML = "<br>ITEM LEVEL MAXED. GAIN " + Math.pow(3,skillDataArray[index].rarity) + "☘️ INSTEAD.";
        document.getElementById("generalNotice").style.display = "block";

        setTimeout(()=> {
            document.getElementById("generalNotice").style.display = "none";
        }, 1200);
        updateMoney();
    }
}

function checkGemLevelUp(index) {
    if (originalPlayerGemstoneLevel[index] < 10) {
    if (originalGemstoneAmount[index] >= (2*originalPlayerGemstoneLevel[index])) {
        originalGemstoneAmount[index] -= (2*originalPlayerGemstoneLevel[index]);
        originalPlayerGemstoneLevel[index]++;
        gemstoneDataArray[index].level++;
        gemstoneDataArray[index].updateValue();

        saveGame();

        if (SFXAllowed) {
            document.getElementById("playerRankUp").currentTime = 0;
            document.getElementById("playerRankUp").play();
        }

        if (originalPlayerGemstoneLevel[index] == 1) {
            document.getElementById("unlockedCardName").innerHTML = gemstoneDataArray[index].name;
            document.getElementById("unlockedCardSRC").src = gemstoneDataArray[index].src;
            document.getElementById("unlockNotice").classList.add("fadeIn");
            document.getElementById("unlockNotice").style.display = "block";
        }
        else {
            document.getElementById("leveledUpCardName").innerHTML = gemstoneDataArray[index].name;
            document.getElementById("leveledUpCardLevel").innerHTML = gemstoneDataArray[index].level;
            document.getElementById("leveledUpCardSRC").src = gemstoneDataArray[index].src;
            document.getElementById("levelUpNotice").classList.add("fadeIn");
            document.getElementById("levelUpNotice").style.display = "block";
        }

        setTimeout(()=> {
            document.getElementById("levelUpNotice").classList.remove("fadeIn");
            document.getElementById("levelUpNotice").style.display = "none";

            document.getElementById("unlockNotice").classList.remove("fadeIn");
            document.getElementById("unlockNotice").style.display = "none";
        }, 1200);
    }
    } else {
        currBlessing += Math.pow(3,gemstoneDataArray[index].rarity);
        updateMoney();
    }
}

function rerollShopItem() {
    if (currMoney >= 500) {
        currMoney -= 500;
        updateMoney();
        generateShopItem();
    }
}

function checkShopReset() {
    gamesTillShopReset -= 1;
    if (gamesTillShopReset == 0) {
        firstTimeGenerated = false;
        gamesTillShopReset = 5;
    }
    document.getElementById("howManyTimesTillReset").innerHTML = gamesTillShopReset;

}







function openGachaMenu() {
    document.getElementById("gachaMenu").classList.add("fadeIn");
    document.getElementById("gachaMenu").style.display = "block";

    document.getElementById("goGacha").style.display="none";

    setTimeout(()=>{
        document.getElementById("gachaMenu").classList.remove("fadeIn");
    }, 190);

}

function noMoreGacha() {
    document.getElementById("gachaMenu").style.display = "none";
    document.getElementById("goGacha").style.display="block";
}

let banner0 = new gachaBanner(0, 0);
banner0.src = "./Image/Banner/banner1.png";
banner0.featuredItems.push(13);

let banner1 = new gachaBanner(1, 0);
banner1.src = "./Image/Banner/banner2.png";
banner1.featuredItems.push(12);

let gemBanner0 = new gachaBanner(2, 1);
gemBanner0.src = "./Image/Banner/gemBanner1.png";
gemBanner0.featuredItems.push(11);
gemBanner0.featuredItems.push(12);


function swapGacha(direction) {
    currentBannerIndex += direction;

    if (currentBannerIndex < 0) {
        currentBannerIndex = bannerArray.length-1;
    } else if (currentBannerIndex == bannerArray.length) {
        currentBannerIndex = 0;
    }

    if (SFXAllowed) {
        document.getElementById("buttonOnHover").currentTime = 0;
        document.getElementById("buttonOnHover").play();
    }

    document.getElementById("bannerImage").classList.remove("fadeIn");
    document.getElementById("bannerImage").classList.add("fadeOut");
    setTimeout(()=> {
    document.getElementById("bannerImage").src = bannerArray[currentBannerIndex].src;
    document.getElementById("bannerImage").classList.remove("fadeOut");
    document.getElementById("bannerImage").classList.add("fadeIn");
    }, 190);
}


function revealDropRate() {
    document.getElementById("showDropRate").classList.toggle("showBoard");
}



let pullsTillLegendary = 80;
let pullsTillSR = 25;

let firstTimeSR = 2;
let firstTimeUR = 4;

let URlimit = 5;

let currentGachaResult = "URGacha"; // 0, 1, 2, 3.

let videoID = 0;

let hasUR = 0;
let hasSR = 0;
let hasR = 0;

let generatedCards = [];

function IStopGachaHere() {
    document.getElementById("gachaResultScreen").style.display = "none";
    document.getElementById("gachaResultSE").pause();

    if (musicAllowed) {
        document.getElementById("titleMusic").play();
    }

    goToScreen("gachaScreen", "shopScreen");

    for (let i = 0; i < 10; i++){
        document.getElementById("gacha"+i+"display").style.display = "none";
    }
}


function gachaProceed(index) {

    if (currDiamond >= index) {

    currDiamond -= index;
    updateMoney();
    document.getElementById("gachaResultSE").pause();
    document.getElementById("titleMusic").pause();

    for (let i = 0; i < 10; i++){
        document.getElementById("gacha"+i+"display").style.display = "none";
    }

    document.getElementById("gachaResultScreen").style.display = "none";
    generatedCards = [];

    hasUR = 0;
    hasSR = 0;
    hasR = 0;

    generateGachaCards(index);

    if (hasUR > 0) {
        currentGachaResult = "URGacha";
    } else if (hasSR > 0) {
        currentGachaResult = "SRGacha";
    } else if (hasR > 0) {
        currentGachaResult = "rareGacha";
    } else {
        currentGachaResult = "commonGacha";
    }


    goToScreen("shopScreen", "gachaScreen");
    videoID = setTimeout(()=>{
        showGachaResultScreen();
    }, 10500);

    let GCanimation = document.getElementById(currentGachaResult);
    document.getElementById("gachaDisplay").style.display = "block";
    GCanimation.volume = 0.5;
    GCanimation.currentTime = 0;
    GCanimation.style.display = "block";
    GCanimation.play();
    }
    else {
        document.getElementById("generalNotice").innerHTML = "<br>NOT ENOUGH 💎 DIAMOND.";
        document.getElementById("generalNotice").style.display = "block";

        setTimeout(()=> {
            document.getElementById("generalNotice").style.display = "none";
        }, 1200);
    }
}


function skipGachaAnimation() {
    showGachaResultScreen();
    clearTimeout(videoID);
}

function generateGachaCards(numOfSummons) {

    if (firstTimeUR > 0) {
        firstTimeSR -= 1;
        firstTimeUR -= 1;
    }


    let currentSourceArray = skillDataArray;
    if (currentBannerIndex == 2) {
        currentSourceArray = gemstoneDataArray;
    }
    
    for (let i = 0; i < numOfSummons; i++) {
        
        let gachaResult = Math.floor((100*Math.random()+100*Math.random())/2);
        let obtainedCard = -1;

        if (firstTimeSR > 0) {
            if (gachaResult > 66) {
                if (currentBannerIndex == 2) {
                    obtainedCard = Math.floor(4*Math.random()+4);
                    unlockedGemRare = true;
                    originalGemstoneAmount[obtainedCard] += 1;
                } else {
                    obtainedCard = Math.floor(4*Math.random()+6);
                    unlockedSkillRare = true;
                    originalCardAmount[obtainedCard] += 1;
                }
                hasR = 1;
            }
            else {
                if (currentBannerIndex == 2) {
                    obtainedCard = Math.floor(4*Math.random());
                    originalGemstoneAmount[obtainedCard] += 1;
                } else {
                    obtainedCard = Math.floor(6*Math.random());
                    originalCardAmount[obtainedCard] += 1;
                }
            }

        } else if (firstTimeUR > 0) {
            if (gachaResult > 91 || pullsTillSR == 2) {
                if (currentBannerIndex == 2) {
                    obtainedCard = Math.floor(3*Math.random()+8);
                    unlockedGemSR = true;
                    originalGemstoneAmount[obtainedCard] += 1;
                } else {
                    obtainedCard = Math.floor(2*Math.random()+10);
                    unlockedSkillSR = true;
                    originalCardAmount[obtainedCard] += 1;
                }
                hasSR = 1;
                pullsTillSR = 32;
            }
    
            else if (gachaResult > 66) {
                if (currentBannerIndex == 2) {
                    obtainedCard = Math.floor(4*Math.random()+4);
                    unlockedGemRare = true;
                    originalGemstoneAmount[obtainedCard] += 1;
                } else {
                    obtainedCard = Math.floor(4*Math.random()+6);
                    unlockedSkillRare = true;
                    originalCardAmount[obtainedCard] += 1;
                }
                hasR = 1;
            }
    
            else {
                if (currentBannerIndex == 2) {
                    obtainedCard = Math.floor(4*Math.random());
                    originalGemstoneAmount[obtainedCard] += 1;
                } else {
                    obtainedCard = Math.floor(6*Math.random());
                    originalCardAmount[obtainedCard] += 1;
                }
            }
        }
    
        else {

        if (gachaResult > 98 || pullsTillLegendary == 1) {
            if (currentBannerIndex == 2) {
                obtainedCard = bannerArray[currentBannerIndex].featuredItems[Math.floor(2*Math.random())];
                unlockedGemUR = true;
                originalGemstoneAmount[obtainedCard] += 1;
            } else {
                obtainedCard = bannerArray[currentBannerIndex].featuredItems[0];
                unlockedSkillUR = true;
                originalCardAmount[obtainedCard] += 1;
            }
            hasUR = 1;
            currentURChance = 0;
            pullsTillLegendary = 80;
        }

        else if (gachaResult > 91 || pullsTillSR == 2) {
            if (currentBannerIndex == 2) {
                obtainedCard = Math.floor(3*Math.random()+8);
                unlockedGemSR = true;
                originalGemstoneAmount[obtainedCard] += 1;
            } else {
                obtainedCard = Math.floor(2*Math.random()+10);
                unlockedSkillSR = true;
                originalCardAmount[obtainedCard] += 1;
            }
            hasSR = 1;
            pullsTillSR = 32;
        }

        else if (gachaResult > 66) {
            if (currentBannerIndex == 2) {
                obtainedCard = Math.floor(4*Math.random()+4);
                unlockedGemRare = true;
                originalGemstoneAmount[obtainedCard] += 1;
            } else {
                obtainedCard = Math.floor(4*Math.random()+6);
                unlockedSkillRare = true;
                originalCardAmount[obtainedCard] += 1;
            }
            hasR = 1;
        }

        else {
            if (currentBannerIndex == 2) {
                obtainedCard = Math.floor(4*Math.random());
                originalGemstoneAmount[obtainedCard] += 1;
            } else {
                obtainedCard = Math.floor(6*Math.random());
                originalCardAmount[obtainedCard] += 1;
            }
        }
    }
        

        
    generatedCards.push(obtainedCard);
        


        if (obtainedCard > -1) {

            document.getElementById("gacha" + i + "Name").innerHTML = currentSourceArray[obtainedCard].name;
            //console.log(document.getElementById("gacha" + i + "Img"));
            document.getElementById("gacha" + i + "Img").src = currentSourceArray[obtainedCard].src;
            
            if (currentSourceArray[obtainedCard].rarity == 0) {
                document.getElementById("gacha" + i + "Rarity").innerHTML = "COMMON";
                document.getElementById("gacha" + i + "display").style.backgroundColor = "rgba(0, 255, 0, 0.7)";
                document.getElementById("gacha" + i + "display").style.border = "5px solid green";
            } 
            else if (currentSourceArray[obtainedCard].rarity == 1) {
                document.getElementById("gacha" + i + "Rarity").innerHTML = "RARE";
                document.getElementById("gacha" + i + "display").style.backgroundColor = "rgba(0, 80, 190, 0.7)";
                document.getElementById("gacha" + i + "display").style.border = "5px solid blue";
            }
            else if (currentSourceArray[obtainedCard].rarity == 2) {
                document.getElementById("gacha" + i + "Rarity").innerHTML = "SUPER RARE";
                document.getElementById("gacha" + i + "display").style.backgroundColor = "rgba(150, 0, 240, 0.7)";
                document.getElementById("gacha" + i + "display").style.border = "5px solid purple";
            } else if (currentSourceArray[obtainedCard].rarity == 3) {
                document.getElementById("gacha" + i + "Rarity").innerHTML = "LEGENDARY";
                document.getElementById("gacha" + i + "display").style.backgroundColor = "rgba(255, 0, 0, 0.7)";
                document.getElementById("gacha" + i + "display").style.border = "5px solid red";
            }



            document.getElementById("gacha" + i + "display").style.display = "inline-block";
            pullsTillLegendary -= 1;
            pullsTillSR -= 1;
        }
    }

    document.getElementById("numsOfPullTillGuarantee").innerHTML = pullsTillLegendary;
}

function showGachaResultScreen() {

    updateMoney();

    if (SFXAllowed) {
        document.getElementById("gachaResultSE").currentTime = 0;
        document.getElementById("gachaResultSE").play();
    }

    for (let i = 0; i < generatedCards.length; i++) {
        if (currentBannerIndex == 2) {
            checkGemLevelUp(generatedCards[i]);
        } else {
            checkCardLevelUp(generatedCards[i]);
        }
    }

    document.getElementById(currentGachaResult).pause();
    document.getElementById(currentGachaResult).style.display = "none";
    document.getElementById("gachaDisplay").style.display = "none";

    document.getElementById("gachaResultScreen").classList.add("fadeIn");
    document.getElementById("gachaResultScreen").style.display = "block";

    document.getElementById("gcTable").classList.add("slowFadeIn");

    setTimeout(()=>{
        document.getElementById("gachaResultScreen").classList.remove("fadeIn");
        document.getElementById("gcTable").classList.remove("slowFadeIn");
    }, 700);
}

