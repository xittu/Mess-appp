const fs = require('fs');

let sideMenu = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
sideMenu = sideMenu.replace(/\{dutyAssignments\.length\} Days Assigned/g, '{dutyAssignments.length} {t("sideMenu.daysAssigned")}');
fs.writeFileSync('src/components/SideMenu.tsx', sideMenu);

let mealsTab = fs.readFileSync('src/components/MealsTab.tsx', 'utf8');
mealsTab = mealsTab.replace(/t\("meals.activeMembers"\)/g, 't("meals.activeCount")');
fs.writeFileSync('src/components/MealsTab.tsx', mealsTab);

