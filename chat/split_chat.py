"""
Split chat_viewer.html into:
  - chat.html  : lightweight shell (~few KB), loads data.js dynamically
  - data.js    : all the WEFLOW_DATA (the big part)
"""
import re

with open('chat_viewer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the data block: window.WEFLOW_DATA = [...];
# It starts at line 369 (after <script>) and ends before the closing </script>
# We'll find the exact positions
start_marker = 'window.WEFLOW_DATA = ['
end_marker = '];\n    </script>'

start_idx = content.index(start_marker)
end_idx = content.index(end_marker, start_idx) + len(end_marker)

data_block = content[start_idx : end_idx - len('\n    </script>')]  # just the assignment

# Build data.js
data_js = data_block + '];\n'
with open('data.js', 'w', encoding='utf-8') as f:
    f.write(data_js)

print(f"data.js size: {len(data_js.encode('utf-8')) / 1024 / 1024:.1f} MB")

# Build chat.html: replace the inline data with a script src load
shell = (
    content[:start_idx]
    + 'window.WEFLOW_DATA = [];'  # placeholder
    + content[end_idx - len('\n    </script>'):]  # keep closing tag
)

# Insert a <script src="data.js"> before the closing </head>
# Actually insert before the first <script> that uses WEFLOW_DATA
# Find the second script tag (the logic script)
logic_script_pos = content.index('<script>', content.index('<script>') + 1)

# Rebuild: replace inline data with external load
shell = (
    content[:start_idx]
    + '// data loaded externally'
    + content[end_idx - len('\n    </script>'):]
)

# Add script tag to load data.js before the logic script
# Find the second <script> in shell
second_script = shell.index('<script>', shell.index('<script>') + 1)
DATA_JS_URL = 'https://cdn.jsdelivr.net/gh/xhc0411abcdef-del/xhc-memories@main/chat/data.js'
shell = (
    shell[:second_script]
    + f'<script src="{DATA_JS_URL}"></script>\n    '
    + shell[second_script:]
)

with open('chat.html', 'w', encoding='utf-8') as f:
    f.write(shell)

print(f"chat.html size: {len(shell.encode('utf-8')) / 1024 / 1024:.1f} MB")
print("Done!")
