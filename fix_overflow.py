import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the root div className
old_root = 'className="w-full min-h-screen flex flex-col shadow-2xl relative bg-slate-50 dark:bg-zinc-950/20 border-x border-slate-200 dark:border-purple-950/15 overflow-x-hidden"'
new_root = 'className="w-full min-h-screen flex flex-col shadow-2xl relative bg-slate-50 dark:bg-zinc-950/20 border-x border-slate-200 dark:border-purple-950/15"'

content = content.replace(old_root, new_root)

with open('src/App.tsx', 'w') as f:
    f.write(content)

