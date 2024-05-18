# This folder contains a bunch of utilities that we use along side with this project.

## stitch_all_overlays.py
1. Create venv
- #### Mac/Linux
```sh
virtualenv overlays_env && source overlays_env/bin/activate && pip install -r requirements.txt
```
- #### Windows 
![Windows Logo](https://static.wikia.nocookie.net/wnr/images/1/18/Static-assets-upload1811341065938287602.webp/revision/latest?cb=20231008015228)
```sh
virtualenv overlays_env && overlays_env\Scripts\activate && pip install -r requirements.txt
```

2. Run
Navigate to the utilities dir in terminal and...
```sh
py overlays.py
```

### NOTES
- #### Tailor Your layers.json
    - By default the script will run for every object with a layer_id 
    - You can tailor as needed directly in the script ¯\_(ツ)_/¯
