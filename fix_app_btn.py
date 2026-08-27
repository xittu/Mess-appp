import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="fixed bottom-40 right-6 bg-rose-600 hover:bg-rose-500 text-white p-4 rounded-full shadow-xl shadow-rose-500/20 flex items-center justify-center z-40 transition-transform active:scale-95 group"',
    'className="fixed bottom-24 left-6 bg-rose-600 hover:bg-rose-500 text-white p-4 rounded-full shadow-xl shadow-rose-500/20 flex items-center justify-center z-40 transition-transform active:scale-95 group"'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
