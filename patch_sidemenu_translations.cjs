const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  `Theme
                </button>`,
  `{t("sideMenu.theme") || "Theme"}
                </button>`
);

code = code.replace(
  `<h3 className="font-bold text-[15px] font-sans">App Theme</h3>`,
  `<h3 className="font-bold text-[15px] font-sans">{t("sideMenu.theme") || "App Theme"}</h3>`
);

code = code.replace(
  `{ id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System Default', icon: Monitor }`,
  `{ id: 'light', label: t("sideMenu.light") || 'Light', icon: Sun },
                    { id: 'dark', label: t("sideMenu.dark") || 'Dark', icon: Moon },
                    { id: 'system', label: t("sideMenu.systemDefault") || 'System Default', icon: Monitor }`
);

code = code.replace(
  `Find Mess Near You</span>`,
  `{t("sideMenu.findMess") || "Find Mess Near You"}</span>`
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
