const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `const [isJobRegisterOpen, setIsJobRegisterOpen] = useState<boolean>(false);`;
const insertStr = `
  const [isFindMessOpen, setIsFindMessOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState("");
  const [chatUserName, setChatUserName] = useState("");
`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, targetStr + insertStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed states");
} else {
  console.log("Target not found!");
}
