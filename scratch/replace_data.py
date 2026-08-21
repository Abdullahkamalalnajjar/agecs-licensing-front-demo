import os
import glob
import re

files = glob.glob('src/app/**/*.tsx', recursive=True) + glob.glob('src/components/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to match variableName.data?.isSuccess -> (variableName.data as any)?.isSuccess
    # and variableName.data?.value -> (variableName.data as any)?.value
    # and variableName.data.value -> (variableName.data as any)?.value
    new_content = re.sub(r'([a-zA-Z0-9_]+)\.data\?\.isSuccess', r'(\1.data as any)?.isSuccess', content)
    new_content = re.sub(r'([a-zA-Z0-9_]+)\.data\?\.isError', r'(\1.data as any)?.isError', new_content)
    new_content = re.sub(r'([a-zA-Z0-9_]+)\.data\?\.value', r'(\1.data as any)?.value', new_content)
    new_content = re.sub(r'([a-zA-Z0-9_]+)\.data\.value', r'(\1.data as any)?.value', new_content)
    new_content = re.sub(r'([a-zA-Z0-9_]+)\.data\?\.errors', r'(\1.data as any)?.errors', new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

