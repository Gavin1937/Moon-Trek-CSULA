import requests, os, json
from PIL import Image

# Ranges found in: https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd/1.0.0/WMTSCapabilities.xml
# Look at tile matrix set under the individual tilematrix heights and widths.
zoom_ranges =[{'y':2**i, 'x':2**(i+1)} for i in range(7)]
print(zoom_ranges)

def get_overlay_tiles(overlay_name, base_path = os.getcwd(), file_type='png', zoom_level = 2):
    """
    Gets all overlay tiles and saves each image to a directory.

    Parameters:
    - overlay_name (str): Name of the overlay which can be found on -> https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon.
    - base_path (str): Path to the directory you want to create the new overlay tile directory in.
    Returns:
    - None
    """
    if not os.path.exists(f'{base_path}/tiles'):
        os.mkdir(f'{base_path}/tiles')
    path = f'{base_path}/tiles/{overlay_name}'


    for x in range(zoom_ranges[zoom_level]['x']):
        for y in range(zoom_ranges[zoom_level]['y']):
            url =f'https://trek.nasa.gov/tiles/Moon/EQ/{overlay_name}/1.0.0//default/default028mm/{zoom_level}/{y}/{x}.{file_type}'
            print(url)
            try:
                res = requests.get(url)
                if res.ok:
                    if not os.path.exists(path):
                        os.mkdir(path)
                    img_data = res.content
                    with open(f'tiles/{overlay_name}/{overlay_name}x{x}y{y}.{file_type}', 'wb') as handler:
                        handler.write(img_data)
                else:
                    # If a tile endpoint is 404 that just means it's a blank tile. Leave the tile blank in the stitched image
                    print(overlay_name, res.status_code)
            except:
                print('Skipping: ', url)

def stitch_overlay_tiles(overlay_name, base_path = os.getcwd(), file_type='png', zoom_level = 2):
    """
    Gets all overlay tiles from a directory and stitches them into one png.

    Parameters:
    - overlay_name (str): Name of the overlay which can be found on -> https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon.
    - base_path (str): Location of already existing tile directory
    Returns:
    - None
    """

    IMG_WIDTH = 256
    IMG_HEIGHT = 256
    
    path = f'{base_path}/full_overlays'
    if not os.path.exists(path):
        os.mkdir(path)

    stitched_image = Image.new('RGBA', ((zoom_ranges[zoom_level]['x']) * IMG_WIDTH, zoom_ranges[zoom_level]['y'] * IMG_HEIGHT))
    worked = False
    for x in range(zoom_ranges[zoom_level]['x']):
        for y in range(zoom_ranges[zoom_level]['y']):
            if os.path.exists(f'tiles/{overlay_name}/{overlay_name}x{x}y{y}.{file_type}'):
                with Image.open(f'tiles/{overlay_name}/{overlay_name}x{x}y{y}.{file_type}') as img:
                    stitched_image.paste(img, (x * IMG_WIDTH, y * IMG_HEIGHT))
                    worked = True
    if worked:
        stitched_image.save(f'{path}/{overlay_name}.{file_type}')

data = None
with open('layers.json','r') as f:
    data = json.load(f)
    
def process_overlay(overlay_name,zoom_level):
    get_overlay_tiles(overlay_name,zoom_level=zoom_level)
    stitch_overlay_tiles(overlay_name,zoom_level=zoom_level)

success = 0
for layer in data:
    try:
        process_overlay(layer["layer_id"],2)
        success+=1
    except Exception as e:
        print(e)