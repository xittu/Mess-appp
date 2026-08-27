import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import if not present
if "import SupportModal" not in content:
    content = content.replace(
        'import Header from "./components/Header";',
        'import Header from "./components/Header";\nimport SupportModal from "./components/SupportModal";'
    )

# find the start and end of the modal to replace
start_comment = "{/* Customer Support Modal */}"
end_comment = "</AnimatePresence>"

# we need to find the specific AnimatePresence for Customer Support Modal
start_idx = content.find(start_comment)

# find the AnimatePresence after the start_idx
if start_idx != -1:
    end_idx = content.find(end_comment, start_idx) + len(end_comment)
    
    # Replace the chunk with <SupportModal />
    content = content[:start_idx] + "{/* Customer Support Modal */}\n        <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />" + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
