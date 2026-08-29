import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace <div className="relative"> around Header with <div className="sticky top-0 z-50 w-full">
# Be careful to target the right one
old_block = """        {/* Dynamic App Header */}
        <div className="relative">
          <Header"""
new_block = """        {/* Dynamic App Header */}
        <div className="sticky top-0 z-50 w-full bg-white dark:bg-brand-card/95 shadow-sm">
          <Header"""

content = content.replace(old_block, new_block)

with open('src/App.tsx', 'w') as f:
    f.write(content)

