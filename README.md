# Data Gaz

## Description

Github repository for [datagaz.fr](datagaz.fr). 
This repository contains the necessary source code to fetch data and run data gaz website

## Installation & Usage

### Backend

In this folder, you will find utility scripts you can use to fetch and update data.

- Install Python dependencies (tested with Python 3.8 & 3.9)
```shell
pip install -r requirements.txt
```

- Fetch data from sources (AGSI and ENTSOG):
```shell
python3 update_data.py
```

- Upload data to Github (create file used by the website):
```shell
python3 upload_data.py
```

### Website

In this folder, you will find source code for the website [datagaz.fr](datagaz.fr)

- Install node dependencies:
```shell
npm install
```

- Start the development server (Open [http://localhost:3000](http://localhost:3000) to view it in your browser.):
```shell
npm start
```

- Build the app for production:
```shell
npm run build
```

## Data Sources

Data comes from two providers:
- [AGSI](https://agsi.gie.eu/): For storage data. Note that you will need an api key to request this API
  (you should provide it in `backend/config.py`, field `x-key`).
  You can get an api (for free) by [creating an account](https://agsi.gie.eu/account) on the platform
- [ENTSOG](https://transparency.entsog.eu/#/map): For consumption and flow data. 
  You don't need any account to query the API

## Support & Contribution

Feel free to open issues or pull request if you find bugs or want to add some improvements to the code base.

If you want to contact me for other purpose (non-tech), you can use the contact form on the website.

## Roadmap

Future development will focus on adding more useful data on the website.

## License

Licence Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License (see [Licence](LICENSE.md))

Copyright (c) 2022 Nicolas MAUTI
