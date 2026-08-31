const fs = require('fs');

// Fix App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  `import React, { useState, useEffect } from "react";`,
  `import React, { useState, useEffect, useRef } from "react";`
);
fs.writeFileSync('src/App.tsx', appCode);

// Fix SideMenu.tsx
let sideMenuCode = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
sideMenuCode = sideMenuCode.replace(
  `  Sun, Moon, Monitor,`,
  `  Sun, Moon, Monitor, ArrowLeft, CheckCircle2,`
);
fs.writeFileSync('src/components/SideMenu.tsx', sideMenuCode);
