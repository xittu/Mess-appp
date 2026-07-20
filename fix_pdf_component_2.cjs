const fs = require('fs');

let sideMenu = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

sideMenu = sideMenu.replace(/<div class="label">\{t\("sideMenuFixed\.totalBazaar"\)\} খরচ<\/div>/g, '<div class="label">${t("sideMenuFixed.totalBazaar")}</div>');
sideMenu = sideMenu.replace(/<div class="label">মোট \{t\("sideMenuFixed\.utilityCost"\)\} খরচ<\/div>/g, '<div class="label">${t("sideMenuFixed.totalUtilityCost")}</div>');
sideMenu = sideMenu.replace(/<div class="label">সর্ব\{t\("sideMenuFixed\.totalCost"\)\}<\/div>/g, '<div class="label">${t("sideMenuFixed.grandTotal")}</div>');
sideMenu = sideMenu.replace(/<h2 class="section-title" style="margin-top: 0;">\{t\("sideMenuFixed\.utilityCost"\)\} খরচের তালিকা<\/h2>/g, '<h2 class="section-title" style="margin-top: 0;">${t("sideMenuFixed.utilityList")}</h2>');

sideMenu = sideMenu.replace(/<span class="stat-lbl">\{t\("sideMenuFixed\.totalBazaar"\)\} খরচ<\/span>/g, '<span class="stat-lbl">${t("sideMenuFixed.totalBazaar")}</span>');
sideMenu = sideMenu.replace(/<span class="stat-lbl">মেস \{t\("sideMenuFixed\.utilityCost"\)\} বিল<\/span>/g, '<span class="stat-lbl">${t("sideMenuFixed.messUtilityBill")}</span>');

// `টি` which means `piece` / `count`.
sideMenu = sideMenu.replace(/\$\{memberMeals\} টি/g, '${memberMeals} ${t("meals.individualMeals")}');
sideMenu = sideMenu.replace(/\$\{totalMeals\} টি/g, '${totalMeals} ${t("meals.individualMeals")}');

fs.writeFileSync('src/components/SideMenu.tsx', sideMenu);
