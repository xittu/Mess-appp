import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace import
content = content.replace('import SupportModal from "./components/SupportModal";', 'import SupportWidget from "./components/SupportWidget";')

# Remove the state
content = re.sub(r'const \[showSupportModal, setShowSupportModal\] = useState<boolean>\(false\);\n?', '', content)

# Replace the JSX
old_jsx = """        {/* Floating Customer Support Button */}
        <button
          onClick={() => setShowSupportModal(true)}
          className="fixed bottom-24 left-6 bg-rose-600 hover:bg-rose-500 text-white p-4 rounded-full shadow-xl shadow-rose-500/20 flex items-center justify-center z-40 transition-transform active:scale-95 group"
          aria-label="Customer Support"
        >
          <Headset className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Customer Support Modal */}
        <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />"""

new_jsx = """        {/* Customer Support Widget */}
        <SupportWidget />"""

if old_jsx in content:
    content = content.replace(old_jsx, new_jsx)
else:
    print("Could not find the exact JSX block. Will try generic regex replacement.")
    # Generic replacement
    pattern = r'\{\/\* Floating Customer Support Button \*\/}.*?<SupportModal isOpen=\{showSupportModal\} onClose=\{.*?\/>'
    content = re.sub(pattern, new_jsx, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
