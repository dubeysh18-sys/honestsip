import subprocess
out = subprocess.check_output(['git', 'show', 'HEAD:src/components/Layout.jsx'])
with open('c:/Users/harsh/.gemini/antigravity/honestsip/layout.txt', 'wb') as f:
    f.write(out)
