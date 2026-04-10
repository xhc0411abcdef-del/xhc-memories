"""
Generate final chat.html that:
1. Loads data1.js and data2.js from jsDelivr
2. Merges them into window.WEFLOW_DATA before the app logic runs
"""

BASE_CDN = "https://cdn.jsdelivr.net/gh/xhc0411abcdef-del/xhc-memories@main/chat"

with open('chat_viewer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the inline data block and replace with external load
start_marker = 'window.WEFLOW_DATA = ['
end_marker = '];\n    </script>'

start_idx = content.index(start_marker)
end_idx = content.index(end_marker, start_idx) + len(end_marker)

# Replace inline data with a placeholder + merge script
inline_replacement = (
    '// Data loaded externally\n'
    '      window.WEFLOW_DATA = [];\n'
    '    </script>\n'
    f'    <script src="{BASE_CDN}/data1.js"></script>\n'
    f'    <script src="{BASE_CDN}/data2.js"></script>\n'
    '    <script>\n'
    '      // Merge split data\n'
    '      if (window.WEFLOW_DATA_1 && window.WEFLOW_DATA_2) {\n'
    '        window.WEFLOW_DATA = window.WEFLOW_DATA_1.concat(window.WEFLOW_DATA_2);\n'
    '      }\n'
)

shell = content[:start_idx] + inline_replacement + content[end_idx:]

with open('chat.html', 'w', encoding='utf-8') as f:
    f.write(shell)

import os
print(f"chat.html size: {os.path.getsize('chat.html') / 1024:.1f} KB")
print("Done!")
