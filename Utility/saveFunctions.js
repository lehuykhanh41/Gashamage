function saveGame() {
    localStorage.setItem("HasProfile", "true");

    localStorage.setItem("myMoney", currMoney);
    localStorage.setItem("myDiamond", currDiamond);
    localStorage.setItem("myBlessings", currBlessing);
    localStorage.setItem("totalKilled", totalMonsterKilled);

    localStorage.setItem("myWeaponLevel", JSON.stringify(originalPlayerWeaponLevel));

    localStorage.setItem("mySkillLevel", JSON.stringify(originalPlayerSkillLevel));
    localStorage.setItem("mySkillCardAmount", JSON.stringify(originalCardAmount));

    localStorage.setItem("myGemstoneLevel", JSON.stringify(originalPlayerGemstoneLevel));
    localStorage.setItem("myGemstoneAmount", JSON.stringify(originalGemstoneAmount));

    localStorage.setItem("currentEquippedSkill", JSON.stringify(skillArray));
    localStorage.setItem("gemstoneArray", gemstoneArray[0]);
    localStorage.setItem("weaponArray", weaponArray[0]);

    localStorage.setItem("testerCodeUsed", testerCodeUsed);
}

function loadGame() {

    loadMonsterData();

    if (localStorage.getItem("HasProfile") == "true") {

        currMoney = parseInt(localStorage.getItem("myMoney"));
        currDiamond = parseInt(localStorage.getItem("myDiamond"));
        currBlessing = parseInt(localStorage.getItem("myBlessings"));
        totalMonsterKilled = parseInt(localStorage.getItem("totalKilled"));

        originalPlayerWeaponLevel = JSON.parse(localStorage.getItem("myWeaponLevel"));
        loadWeaponLevel();
       
        originalPlayerSkillLevel = JSON.parse(localStorage.getItem("mySkillLevel"));
        originalCardAmount = JSON.parse(localStorage.getItem("mySkillCardAmount"));
        loadSkillLevel();

        originalPlayerGemstoneLevel = JSON.parse(localStorage.getItem("myGemstoneLevel"));
        originalGemstoneAmount = JSON.parse(localStorage.getItem("myGemstoneAmount"));
        loadGemstoneLevel();

        skillArray = JSON.parse(localStorage.getItem("currentEquippedSkill"));

        gemstoneArray[0] = parseInt(localStorage.getItem("gemstoneArray"));
        weaponArray[0] = parseInt(localStorage.getItem("weaponArray"));    

        bulletImage.src = "./Bullet/Bullet" + weaponArray[0] + ".png";

        if (parseInt(localStorage.getItem("testerCodeUsed")) !== undefined) {
            testerCodeUsed = parseInt(localStorage.getItem("testerCodeUsed"));
        }
    }

}

function generateBackupCode() {


    document.getElementById("backupCode").innerHTML = "hehe";
}

function evaluateBackupCode() {
    
    let backupCode = document.getElementById("backupCodeFromPlayer").value;
    if (backupCode == "codedocquyentester") {
        if (testerCodeUsed == 0) {
            currDiamond += 100;
            alert("Thành Công ! Chúc mừng bạn đã nhận được 100 kim cương.");
            testerCodeUsed = 1;
            saveGame();
        } else {
            alert("Mã đã qua sử dụng. Không thể nhập tiếp.");
        }
    } else if (backupCode == "BoMayGiauVCLok?") {
        if (currDiamond < 300) {
            currDiamond += 2000;
            currMoney += 100000;
            alert("Bú thành công 2000 kim cương với 100k vàng.");
            saveGame();
        } else {
            alert("Bú vừa thôi đm");
        }
    }
}

window.addEventListener("DOMContentLoaded", (event)=>{
    loadGame();
});