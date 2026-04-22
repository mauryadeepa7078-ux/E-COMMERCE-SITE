import urllib.request
import re
import json
import time

categories = {
    'electronics': 'gadget electronics modern product photography',
    'fashion': 'fashion clothing model lookbook',
    'home': 'interior design furniture home decor',
    'books': 'book cover novel reading',
    'sports': 'sports equipment fitness gear',
    'beauty': 'cosmetics makeup product photography',
    'toys': 'kids toys play',
    'automotive': 'car accessories automotive gear',
    'garden': 'garden tools patio plants outdoor',
    'health': 'healthy lifestyle wellness products'
}

results = {}

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

for cat, query in categories.items():
    images = []
    print("Fetching", cat)
    
    # Try multiple pages to hit 100 items
    for offset in [1, 35, 70, 105]:
        url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}&first={offset}"
        req = urllib.request.Request(url, headers=req_headers)
        try:
            with urllib.request.urlopen(req) as response:
                html = response.read().decode('utf-8')
                # Grab murl from the raw HTML image objects
                found = re.findall(r'murl&quot;:&quot;(.*?)&quot;', html)
                for f in found:
                    if f.startswith('http'):
                        images.append(f)
        except Exception as e:
            print("Error", e)
        time.sleep(1) # Be nice to Bing
    
    # Prune duplicates and slice precisely to 100 if we have them
    unique_images = list(set(images))
    results[cat] = unique_images[:100]
    print(f"Got {len(results[cat])} unique images for {cat}")

js_content = f"const BING_IMAGES = {json.dumps(results, indent=2)};"
with open('c:/Users/user/OneDrive/Desktop/e-commerce/js/bing_images.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Done writing to js/bing_images.js!")
