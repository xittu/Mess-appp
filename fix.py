import re

with open('src/components/SideMenu.tsx', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    line = lines[i]
    if 183 <= (i + 1) <= 613:
        # inside template strings, we want ${currencySymbol} and ${t(
        line = line.replace('$${currencySymbol}', '${currencySymbol}')
    else:
        # inside TSX, we want {currencySymbol} and {t(
        line = line.replace('${currencySymbol}', '{currencySymbol}')
        line = line.replace('${t("sideMenuFixed.balance")}', '{t("sideMenuFixed.balance")}')
    lines[i] = line

with open('src/components/SideMenu.tsx', 'w') as f:
    f.writelines(lines)
