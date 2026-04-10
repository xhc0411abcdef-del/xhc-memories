"""
Generate final chat.html that:
1. Uses fetch() to load data1.js and data2.js from raw.githubusercontent.com
2. Parses the JS assignment to extract JSON array
3. Initializes the app after data is loaded
"""

RAW_BASE = "https://raw.githubusercontent.com/xhc0411abcdef-del/xhc-memories/main/chat"

with open('chat_viewer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the inline data block
start_marker = 'window.WEFLOW_DATA = ['
end_marker = '];\n    </script>'

start_idx = content.index(start_marker)
end_idx = content.index(end_marker, start_idx) + len(end_marker)

# Find the second <script> tag (the app logic)
first_script = content.index('<script>')
second_script = content.index('<script>', first_script + 1)

# The app logic script starts at second_script
# We need to wrap the app initialization so it runs AFTER data is fetched

# Find where allData is initialized in the logic script
alldata_init = "let allData = window.WEFLOW_DATA || [];"
alldata_pos = content.index(alldata_init, second_script)

# Find the renderer creation and updateCount call (the "start" of the app)
renderer_init = "const renderer = new ChunkedRenderer(container, currentList, renderItem);"
renderer_pos = content.index(renderer_init, second_script)

# Build the replacement: 
# 1. Replace inline data with fetch-based loading
# 2. Wrap app initialization in a function called after fetch completes

fetch_script = f'''// Data loaded via fetch from GitHub
      window.WEFLOW_DATA = [];
    </script>
    <script>
      // Show loading indicator
      document.addEventListener('DOMContentLoaded', () => {{
        const container = document.getElementById('scrollContainer');
        if (container) {{
          container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:16px;color:#6b7280;font-family:system-ui"><div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#4f46e5;border-radius:50%;animation:spin 0.8s linear infinite"></div><div>正在加载聊天记录...</div><div style="font-size:12px;opacity:0.6">首次加载约需 10-20 秒</div></div>';
        }}
      }});
      
      async function loadChatData() {{
        const DATA_URLS = [
          '{RAW_BASE}/data1.js',
          '{RAW_BASE}/data2.js'
        ];
        
        const results = await Promise.all(DATA_URLS.map(url => 
          fetch(url).then(r => r.text())
        ));
        
        let allMessages = [];
        for (const text of results) {{
          // Extract JSON array from "window.WEFLOW_DATA_N = [...];"
          const match = text.match(/window\\.WEFLOW_DATA_\\d+\\s*=\\s*(\\[[\\s\\S]*\\]);/);
          if (match) {{
            try {{
              const arr = JSON.parse(match[1]);
              allMessages = allMessages.concat(arr);
            }} catch(e) {{
              console.error('Parse error:', e);
            }}
          }}
        }});
        
        window.WEFLOW_DATA = allMessages;
        return allMessages;
      }}
'''

# Now build the new HTML:
# Part 1: everything before the inline data
part1 = content[:start_idx]

# Part 2: fetch script (replaces inline data)
part2 = fetch_script

# Part 3: the app logic script, but modified to call loadChatData() first
# Get the full app logic script content
app_script_start = content.index('<script>', second_script)
app_script_end = content.rindex('</script>') + len('</script>')
app_script_content = content[app_script_start + len('<script>'):app_script_end - len('</script>')]

# Wrap the app init part in an async function
# Split at the renderer creation line
before_renderer = app_script_content[:app_script_content.index(renderer_init)]
after_renderer_start = app_script_content.index(renderer_init)

# Wrap everything from renderer creation onwards in initApp()
app_init_code = app_script_content[after_renderer_start:]

new_app_script = f'''<script>
      // App logic - initialized after data loads
      {before_renderer}
      
      async function initApp() {{
        const allData = await loadChatData();
        let currentList = allData;
        {app_init_code}
      }}
      
      initApp().catch(console.error);
    </script>'''

# Part 4: everything after the app script
part4 = content[app_script_end:]

final_html = part1 + part2 + new_app_script + part4

with open('chat.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

import os
print(f"chat.html size: {os.path.getsize('chat.html') / 1024:.1f} KB")
print("Done!")
