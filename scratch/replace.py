import os
import glob

# Search in src/app and src/components
files = glob.glob('src/app/**/*.tsx', recursive=True) + glob.glob('src/components/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace 'response.data' with '(response.data as any)'
    # But only if it hasn't been replaced yet.
    if 'response.data' in content and '(response.data as any)' not in content:
        # Avoid replacing inside strings if possible, but in this codebase it's unlikely to have 'response.data' in a string that matters.
        # Actually, let's just do a simple replace
        new_content = content.replace('response.data', '(response.data as any)')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

