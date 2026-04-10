"""
Generate:
  - data1.json and data2.json (pure JSON arrays, no JS wrapper)
  - Updated chat.html that fetches JSON directly
"""
import json, os

RAW_BASE = "https://raw.githubusercontent.com/xhc0411abcdef-del/xhc-memories/main/chat"

print("Reading data.js...")
with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# data.js format: window.WEFLOW_DATA = [\n{...},\n{...}\n];\n
# Extract the array content
arr_start = content.index('[')
arr_end = content.rindex(']') + 1
arr_text = content[arr_start:arr_end]

print("Parsing JSON...")
data = json.loads(arr_text)
total = len(data)
mid = total // 2
print(f"Total messages: {total}, split at: {mid}")

# Write JSON files
print("Writing data1.json...")
with open('data1.json', 'w', encoding='utf-8') as f:
    json.dump(data[:mid], f, ensure_ascii=False, separators=(',', ':'))
print(f"data1.json: {os.path.getsize('data1.json') / 1024 / 1024:.1f} MB")

print("Writing data2.json...")
with open('data2.json', 'w', encoding='utf-8') as f:
    json.dump(data[mid:], f, ensure_ascii=False, separators=(',', ':'))
print(f"data2.json: {os.path.getsize('data2.json') / 1024 / 1024:.1f} MB")

# Now generate the new chat.html
print("Generating chat.html...")
with open('chat_viewer.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the inline data block
start_marker = 'window.WEFLOW_DATA = ['
end_marker = '];\n    </script>'
start_idx = html.index(start_marker)
end_idx = html.index(end_marker, start_idx) + len(end_marker)

# Find the second script tag (app logic)
first_script = html.index('<script>')
second_script = html.index('<script>', first_script + 1)

# Get the app logic content
app_script_end = html.rindex('</script>') + len('</script>')
app_script_content = html[second_script + len('<script>'):app_script_end - len('</script>')]

# Find where to split: before "const renderer = new ChunkedRenderer"
renderer_marker = 'const renderer = new ChunkedRenderer(container, currentList, renderItem);'
split_pos = app_script_content.index(renderer_marker)

before_renderer = app_script_content[:split_pos]
after_renderer = app_script_content[split_pos:]

# Build new HTML
fetch_and_init = f'''
      // Fetch JSON data from GitHub
      async function loadChatData() {{
        const [r1, r2] = await Promise.all([
          fetch('{RAW_BASE}/data1.json'),
          fetch('{RAW_BASE}/data2.json')
        ]);
        const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
        return d1.concat(d2);
      }}
      
      {before_renderer}
      
      async function initApp() {{
        // Show loading state
        const container = document.getElementById('scrollContainer');
        if (container) {{
          container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:16px;color:#6b7280;font-family:system-ui"><div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#4f46e5;border-radius:50%;animation:spin 0.8s linear infinite"></div><p style=\\"margin:0\\">正在加载聊天记录...</p><p style=\\"margin:0;font-size:12px;opacity:0.6\\">首次加载约需 10-20 秒</p></div>';
        }}
        
        const allData = await loadChatData();
        let currentList = allData;
        
        {after_renderer}
      }}
      
      initApp().catch(e => console.error('initApp error:', e));
'''

new_html = (
    html[:start_idx]
    + '// data loaded externally\n    </script>\n    <script>\n'
    + fetch_and_init
    + '\n    </script>'
    + html[app_script_end:]
)

# Add spin keyframe to style
new_html = new_html.replace(
    '.load-sentinel {\n  height: 1px;\n}',
    '.load-sentinel {\n  height: 1px;\n}\n@keyframes spin { to { transform: rotate(360deg); } }'
)

with open('chat.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f"chat.html: {os.path.getsize('chat.html') / 1024:.1f} KB")
print("Done!")
