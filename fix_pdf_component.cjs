const fs = require('fs');

let sideMenu = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

// Replace alerts
sideMenu = sideMenu.replace(/"পিডিএফ জেনারেট সম্পন্ন করতে অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন।"/g, 't("sideMenuFixed.pdfPopupAllow")');
// Replace table placeholders
sideMenu = sideMenu.replace(/কোনো বাজার খরচ নেই।/g, '${t("sideMenuFixed.noBazaarAdded")}');
sideMenu = sideMenu.replace(/কোনো \$\{t\("sideMenuFixed\.utilityCost"\)\} খরচ নেই।/g, '${t("sideMenuFixed.noUtilityAdded")}');

sideMenu = sideMenu.replace(/চলমান মাসে কোনো বাজার খরচ যুক্ত করা হয়নি।/g, '${t("sideMenuFixed.noBazaarCurrent")}');
sideMenu = sideMenu.replace(/কোনো আলাদা \$\{t\("sideMenuFixed\.utilityCost"\)\} বিল যুক্ত করা হয়নি।/g, '${t("sideMenuFixed.noUtilityCurrent")}');

// Old session headers
sideMenu = sideMenu.replace(/<h1>পুরনো সেশন মেস হিসাব বিবরণী<\/h1>/g, '<h1>${t("sideMenuFixed.oldSessionReport")}</h1>');
sideMenu = sideMenu.replace(/<div class="label">\$\{t\("sideMenuFixed\.totalBazaar"\)\} খরচ<\/div>/g, '<div class="label">${t("sideMenuFixed.totalBazaar")}</div>');
sideMenu = sideMenu.replace(/<div class="label">মোট \$\{t\("sideMenuFixed\.utilityCost"\)\} খরচ<\/div>/g, '<div class="label">${t("sideMenuFixed.totalUtilityCost")}</div>');
sideMenu = sideMenu.replace(/<div class="label">সর্ব\$\{t\("sideMenuFixed\.totalCost"\)\}<\/div>/g, '<div class="label">${t("sideMenuFixed.grandTotal")}</div>');

sideMenu = sideMenu.replace(/<h2 class="section-title">সদস্যদের চূড়ান্ত হিসাব<\/h2>/g, '<h2 class="section-title">${t("sideMenuFixed.finalAccountMembers")}</h2>');
sideMenu = sideMenu.replace(/<th>নাম<\/th>/g, '<th>${t("sideMenuFixed.nameCol")}</th>');
sideMenu = sideMenu.replace(/<th>নিজের বাজার<\/th>/g, '<th>${t("sideMenuFixed.ownBazaar")}</th>');
sideMenu = sideMenu.replace(/<th>মিল<\/th>/g, '<th>${t("sideMenuFixed.mealsCol")}</th>');
sideMenu = sideMenu.replace(/<th>বাজার খরচ<\/th>/g, '<th>${t("sideMenuFixed.bazaarCostCol")}</th>');
sideMenu = sideMenu.replace(/<th>বর্তমান অবস্থা<\/th>/g, '<th>${t("sideMenuFixed.currentStatus")}</th>');

sideMenu = sideMenu.replace(/<h2 class="section-title" style="margin-top: 0;">বাজার খরচের তালিকা<\/h2>/g, '<h2 class="section-title" style="margin-top: 0;">${t("sideMenuFixed.bazaarList")}</h2>');
sideMenu = sideMenu.replace(/<th>বিবরণ<\/th>/g, '<th>${t("sideMenuFixed.descCol")}</th>');
sideMenu = sideMenu.replace(/<th>টাকা<\/th>/g, '<th>${t("sideMenuFixed.amountCol")}</th>');

sideMenu = sideMenu.replace(/<h2 class="section-title" style="margin-top: 0;">\$\{t\("sideMenuFixed\.utilityCost"\)\} খরচের তালিকা<\/h2>/g, '<h2 class="section-title" style="margin-top: 0;">${t("sideMenuFixed.utilityList")}</h2>');
sideMenu = sideMenu.replace(/<th>খাতের নাম<\/th>/g, '<th>${t("sideMenuFixed.sectorCol")}</th>');

// Active session stats (lines ~596)
sideMenu = sideMenu.replace(/<span class="stat-lbl">\$\{t\("sideMenuFixed\.totalBazaar"\)\} খরচ<\/span>/g, '<span class="stat-lbl">${t("sideMenuFixed.totalBazaar")}</span>');
sideMenu = sideMenu.replace(/<span class="stat-lbl">মেস \$\{t\("sideMenuFixed\.utilityCost"\)\} বিল<\/span>/g, '<span class="stat-lbl">${t("sideMenuFixed.messUtilityBill")}</span>');

fs.writeFileSync('src/components/SideMenu.tsx', sideMenu);
