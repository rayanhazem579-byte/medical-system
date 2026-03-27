import os

def fix_mojibake(input_path, output_path):
    print(f"Repairing {input_path}...")
    with open(input_path, 'rb') as f:
        data = f.read()
    
    try:
        mangled_str = data.decode('utf-8')
    except UnicodeDecodeError:
        print("File is not valid UTF-8, trying latin1 directly...")
        mangled_str = data.decode('latin1')
    
    cp1252_map = {
        0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
        0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
        0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2118: 0x90, 0x2018: 0x91,
        0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96,
        0x2014: 0x97, 0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
        0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
    }
    
    fixed_bytes = bytearray()
    for char in mangled_str:
        code = ord(char)
        if code in cp1252_map:
            fixed_bytes.append(cp1252_map[code])
        elif code < 256:
            fixed_bytes.append(code)
        else:
            # character is already > 255 (like correct Arabic)
            # we encode it to utf-8 bytes and add them
            fixed_bytes.extend(char.encode('utf-8'))
            
    try:
        final_text = fixed_bytes.decode('utf-8')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_text)
        print("Success!")
    except Exception as e:
        print(f"Error during final decoding: {e}")
        # Try again with replace
        final_text = fixed_bytes.decode('utf-8', errors='replace')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_text)
        print("Saved with some replacements.")

target = r'c:\xampp\htdocs\my-first-app\backend\resources\js\assets\ReceptionPage.tsx'
backup = r'c:\xampp\htdocs\my-first-app\backend\resources\js\assets\ReceptionPage.tsx.bak'

if os.path.exists(target):
    import shutil
    shutil.copy2(target, backup)
    fix_mojibake(target, target)
