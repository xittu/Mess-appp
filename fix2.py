import re

with open('src/components/SideMenu.tsx', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    line = lines[i]
    if 183 <= (i + 1) <= 613:
        # inside template strings, we want ${t( instead of {t(
        line = line.replace('{t("sideMenuFixed.utilityPerMember")}', '${t("sideMenuFixed.utilityPerMember")}')
        line = line.replace('{t("sideMenuFixed.footerCopyright")}', '${t("sideMenuFixed.footerCopyright")}')
        line = line.replace('{t("sideMenuFixed.deposit")}', '${t("sideMenuFixed.deposit")}')
        line = line.replace('{t("sideMenuFixed.utilityCost")}', '${t("sideMenuFixed.utilityCost")}')
        line = line.replace('{t("sideMenuFixed.downloadOrPrint")}', '${t("sideMenuFixed.downloadOrPrint")}')
        line = line.replace('{t("sideMenuFixed.balance")}', '${t("sideMenuFixed.balance")}')
        line = line.replace('$${t(', '${t(')
    lines[i] = line

with open('src/components/SideMenu.tsx', 'w') as f:
    f.writelines(lines)
