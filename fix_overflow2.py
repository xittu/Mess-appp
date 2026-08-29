import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the root div className
old_root = 'className="min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col w-full overflow-x-hidden"'
new_root = 'className="min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col w-full"'

content = content.replace(old_root, new_root)

with open('src/App.tsx', 'w') as f:
    f.write(content)

