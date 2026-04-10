"""
Build final chat.html:
- Extracts everything from chat_viewer.html EXCEPT the inline data
- Replaces app init with async fetch-based loading of data1.json + data2.json
"""

RAW_BASE = "https://raw.githubusercontent.com/xhc0411abcdef-del/xhc-memories/main/chat"

with open('chat_viewer.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ---- Extract parts ----
# Part 1: <head> + styles + HTML body (before the data script)
data_script_start = html.index('\n    <!-- Data Injection -->')
part1 = html[:data_script_start]

# Part 2: The app logic script (second <script> tag, after the data)
# Find the second script tag
first_script_idx = html.index('<script>')
second_script_idx = html.index('<script>', first_script_idx + 1)
last_script_end = html.rindex('</script>') + len('</script>')

app_logic = html[second_script_idx + len('<script>'):last_script_end - len('</script>')]

# Part 3: closing tags after the last </script>
part3 = html[last_script_end:]

# ---- Build new app logic ----
# The original app logic has:
#   class ChunkedRenderer { ... }
#   const searchInput = ...
#   ...
#   let allData = window.WEFLOW_DATA || [];
#   let currentList = allData;
#   const renderItem = ...
#   const renderer = new ChunkedRenderer(...)
#   const updateCount = ...
#   [event listeners]
#   updateCount()
#
# We want to:
# 1. Keep ChunkedRenderer class and DOM refs (searchInput, container, etc.) at top level
# 2. Wrap everything from "let allData" onwards in an async initApp()

split_marker = '      // Initial Data\n      let allData = window.WEFLOW_DATA || [];'
split_idx = app_logic.index(split_marker)

top_level_code = app_logic[:split_idx]  # ChunkedRenderer + DOM refs
init_code = app_logic[split_idx:]       # data init + renderer + event listeners + updateCount()

# Remove the old "let allData = window.WEFLOW_DATA || [];" line
init_code = init_code.replace(
    '      // Initial Data\n      let allData = window.WEFLOW_DATA || [];\n      let currentList = allData;\n',
    ''
)

# Remove trailing "updateCount()\n    " and replace with proper closure
init_code = init_code.rstrip()
if init_code.endswith('updateCount()'):
    init_code = init_code  # keep it

new_app_script = f'''<script>
{top_level_code}
      // ---- Async data loading ----
      async function initApp() {{
        // Show loading spinner
        const loadingHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:16px;color:#6b7280;font-family:system-ui">
          <div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#4f46e5;border-radius:50%;animation:spin 0.8s linear infinite"></div>
          <p style="margin:0">正在加载聊天记录...</p>
          <p style="margin:0;font-size:12px;opacity:0.6">首次加载约需 10-20 秒</p>
        </div>`;
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) scrollContainer.innerHTML = loadingHTML;

        // Fetch both JSON chunks in parallel
        const [r1, r2] = await Promise.all([
          fetch('{RAW_BASE}/data1.json'),
          fetch('{RAW_BASE}/data2.json')
        ]);
        const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
        const allData = d1.concat(d2);
        let currentList = allData;

        // Clear loading spinner (ChunkedRenderer will take over)
        if (scrollContainer) scrollContainer.innerHTML = '';

{init_code}
      }}

      initApp().catch(e => {{
        console.error('Chat load error:', e);
        const c = document.getElementById('scrollContainer');
        if (c) c.innerHTML = '<div style="padding:40px;text-align:center;color:#ef4444">加载失败，请刷新重试</div>';
      }});
    </script>'''

# ---- Add spin keyframe to style ----
part1 = part1.replace(
    '.load-sentinel {\n  height: 1px;\n}',
    '.load-sentinel {\n  height: 1px;\n}\n@keyframes spin { to { transform: rotate(360deg); } }'
)

# ---- Assemble final HTML ----
final_html = part1 + '\n' + new_app_script + part3

with open('chat.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

import os
print(f"chat.html: {os.path.getsize('chat.html') / 1024:.1f} KB")
print("Done!")
