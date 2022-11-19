agsi = {
    'api_endpoint': 'https://agsi.gie.eu/api',
    'query_params': {
        'country': 'FR',
        'from': '2022-01-01'
    },
    'headers': {
        'x-key': 'AGSI_KEY'
    },
    'data_filename': 'agsi_data.json'
}

entsog = {
    'api_endpoint': 'https://transparency.entsog.eu/api/v1/aggregateddata',
    'query_params': {
        'pointDirection': ['fr----------fr-tso-0003exitfinal consumers,'
                           'fr----------fr-tso-0003exitdistribution,'
                           'fr----------fr-tso-0002exitfinal consumers,'
                           'fr----------fr-tso-0002exitdistribution'],
        'from': '2021-01-01',
        'indicator': 'Physical Flow',
        'periodType': 'day',
        'timezone': 'CET',
        'limit': -1
    },
    'data_filename': 'entsog_data.json'
}
