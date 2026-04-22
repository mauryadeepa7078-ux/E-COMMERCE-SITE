import urllib.request
import json
import time

categories = ['electronics', 'fashion', 'home', 'books', 'sports', 'beauty', 'toys', 'automotive', 'garden', 'health']

results = {}

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
}

for cat in categories:
    results[cat] = []
    print("Fetching", cat)
    for page in range(1, 4):
        url = f"https://unsplash.com/napi/search/photos?query={cat}&per_page=30&page={page}"
        req = urllib.request.Request(url, headers=req_headers)
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                for item in data.get('results', []):
                    results[cat].append(item['id'])
        except Exception as e:
            print("Error on", url, e)
        time.sleep(1) # Be nice
    
    # Ensure uniqueness
    results[cat] = list(set(results[cat]))
    print(f"Got {len(results[cat])} unique images for {cat}")

with open('images.json', 'w') as f:
    json.dump(results, f)
print("Done!")
