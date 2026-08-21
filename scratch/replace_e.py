import os
import glob
import re

# Search in src/app and src/components
files = glob.glob('src/app/**/*.tsx', recursive=True) + glob.glob('src/components/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'map\(\(e\)\s*=>', r'map((e: any) =>', content)
    new_content = re.sub(r'map\(e\s*=>', r'map((e: any) =>', new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

