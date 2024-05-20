
## fetch_overlays.py

Fetch all the overlay image pieces described in `layers.json`, and then create the complete overlay file.

1. Create venv

- **Mac/Linux**
```sh
python -m venv overlays_env && source overlays_env/bin/activate && pip install -r requirements.txt
```

- **Windows**
![Windows Logo](https://static.wikia.nocookie.net/wnr/images/1/18/Static-assets-upload1811341065938287602.webp/revision/latest?cb=20231008015228)
```sh
python -m venv overlays_env && overlays_env\Scripts\activate && pip install -r requirements.txt
```

2. Run

Under current directory, launch a terminal and run:
```sh
python fetch_overlays.py
```

### NOTES
- #### Tailor Your layers.json
    - By default the script will run for every object with a layer_id 
    - You can tailor as needed directly in the script ¯\_(ツ)_/¯
