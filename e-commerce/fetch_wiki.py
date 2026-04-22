import urllib.request
import json
import time

categories = {
    'electronics': 'consumer electronics',
    'fashion': 'fashion clothing model',
    'home': 'interior design home',
    'books': 'books library reading',
    'sports': 'sports equipment fitness',
    'beauty': 'cosmetics makeup beauty',
    'toys': 'children toys game',
    'automotive': 'sports car automotive',
    'garden': 'garden patio plants',
    'health': 'healthy food medicine'
}

results = {}

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
}

for cat, query in categories.items():
    images = []
    print("Fetching", cat)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=100&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=req_headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                if 'imageinfo' in page:
                    for info in page['imageinfo']:
                        url = info['url']
                        if url.lower().endswith('.jpg') or url.lower().endswith('.png'):
                            images.append(url)
    except Exception as e:
        print("Error on", url, e)
    
    # Ensure uniqueness
    images = list(set(images))
    results[cat] = images
    print(f"Got {len(results[cat])} unique images for {cat}")

js_content = f"const WIKI_IMAGES = {json.dumps(results, indent=2)};"
with open('c:/Users/user/OneDrive/Desktop/e-commerce/js/wiki_images.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Done writing to js/wiki_images.js!")
