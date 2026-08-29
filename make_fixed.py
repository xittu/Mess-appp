import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_block = """        {/* Dynamic App Header */}
        <div className="sticky top-0 z-50 w-full bg-white dark:bg-brand-card/95 shadow-sm">"""
new_block = """        {/* Dynamic App Header */}
        <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-brand-card/95 shadow-sm">"""
content = content.replace(old_block, new_block)

old_main = """        {/* Dynamic Tab Architecture */}
        <main className="flex-1 mt-2">"""
new_main = """        {/* Dynamic Tab Architecture */}
        <main className="flex-1 mt-[70px]">"""
content = content.replace(old_main, new_main)

# Also make notification center fixed below the header
old_notif = """        {/* Real-time In-App Notification Center Alert Shelf */}
        {showNotificationCenter && (
          <div className="bg-[#151020] border-b border-slate-200 dark:border-purple-950/50 p-4 relative z-30 shadow-lg">"""
new_notif = """        {/* Real-time In-App Notification Center Alert Shelf */}
        {showNotificationCenter && (
          <div className="bg-[#151020] border-b border-slate-200 dark:border-purple-950/50 p-4 fixed top-[56px] left-0 right-0 z-40 shadow-lg w-full">"""
content = content.replace(old_notif, new_notif)

with open('src/App.tsx', 'w') as f:
    f.write(content)
