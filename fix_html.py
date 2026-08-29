import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace <div id="root" ...
content = content.replace('class="overflow-x-hidden w-full relative min-h-screen"', 'class="w-full relative min-h-screen"')
content = content.replace('class="bg-[#0F0C15] text-white overflow-x-hidden w-full m-0 p-0"', 'class="bg-[#0F0C15] text-white w-full m-0 p-0"')

with open('index.html', 'w') as f:
    f.write(content)

