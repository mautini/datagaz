import datetime
import logging
from typing import Any, Dict, List, Tuple

import dateutil.relativedelta
import requests

import config
import model


def _get_agsi_all_countries_and_eu_data(agsi_config: Dict[str, Any]) -> Tuple[Dict[str, str], str]:
    response = requests.get(
        url=agsi_config['api_endpoint'],
        headers=agsi_config['headers']
    )

    body = response.json()
    data = body['data']

    return {
        child['name'].replace(' (Post-Brexit)', ''): child['full']
        for child
        # EU and Non-EU
        in data[0]['children'] + data[1]['children']
        if child['full'] != '-'
    }, data[0]['full']


def _validate_agsi_data(agsi_data: model.AGSIData) -> bool:
    update_date = agsi_data.update_date
    update_date = datetime.datetime.strptime(update_date, '%Y-%m-%d').date()
    today = datetime.date.today()
    # Check that update data roughly match the current date
    if update_date > today:
        logging.error('AGSI update date seems to be in the future', update_date)
        return False

    if (today - update_date).days > 7:
        logging.error('AGSI update date seems to be very old', update_date)
        return False

    if agsi_data.full_rate < -10 or agsi_data.full_rate > 110:
        logging.error('AGSI full rate seems to be out of range', agsi_data.full_rate)
        return False

    if agsi_data.trend > 20 or agsi_data.trend < -20:
        logging.error('AGSI trend seems to be out of range', agsi_data.trend)
        return False

    if agsi_data.max_storage_capacity < 0:
        logging.error('AGSI max storage capacity seems to be out of range', agsi_data.trend)
        return False

    if agsi_data.max_storage_consumption < -10 or agsi_data.max_storage_consumption > 110:
        logging.error('AGSI max storage consumption seems to be out of range', agsi_data.trend)
        return False

    nb_days_from_last_year: int = (today - datetime.date(update_date.year, 1, 1)).days
    if len(agsi_data.france_historical_data) > nb_days_from_last_year:
        logging.error(
            'AGSI: It seems that there is too much data for France historic',
            len(agsi_data.france_historical_data)
        )
        return False

    if len(agsi_data.france_historical_data) < nb_days_from_last_year - 15:
        logging.error(
            'AGSI: It seems that there is too few data for France historic',
            len(agsi_data.france_historical_data)
        )
        return False

    if len(agsi_data.all_countries_data) != 20:
        logging.error(
            'AGSI: Invalid number of countries for European Data',
            len(agsi_data.all_countries_data)
        )
        return False

    for country, full in agsi_data.all_countries_data.items():
        if full < -10 or full > 110:
            logging.error(
                'AGSI full rate seems to be out of range',
                country,
                full
            )
            return False

    if agsi_data.eu_full_rate < -10 or agsi_data.eu_full_rate > 110:
        logging.error('AGSI EU full rate seems to be out of range', agsi_data.full_rate)
        return False

    return True


def _validate_entsog_data(min_nb_values_by_date: int, max_nb_values_by_date: int,
                          entsog_data: model.ENTSOGData) -> bool:
    update_date = entsog_data.update_date
    today = datetime.date.today()
    # Check that update data roughly match the current date
    if update_date > today:
        logging.error('ENTSOG update date seems to be in the future', update_date)
        return False

    if (today - update_date).days > 7:
        logging.error('ENTSOG update date seems to be very old', update_date)
        return False

    if min_nb_values_by_date != 4:
        logging.error('Not enough value in the ENTSOG history', min_nb_values_by_date)
        return False

    if max_nb_values_by_date != 4:
        logging.error('Too many values in the ENTSOG history', min_nb_values_by_date)
        return False

    if entsog_data.last_consumption < 200_000_000:
        logging.error('Consumption seems too low', entsog_data.last_consumption)
        return False

    # Data is in kWh
    if entsog_data.last_consumption > 5_000_000_000:
        logging.error('Consumption seems too high', entsog_data.last_consumption)
        return False

    return True


def _update_agsi_data():
    agsi_config = config.get_agsi_config(datetime.date.today().year)

    all_data = []

    current_page = 0
    last_page = -1
    while current_page != last_page:
        current_page = current_page + 1
        headers = agsi_config['headers']
        params = agsi_config['query_params']
        params['page'] = str(current_page)
        response = requests.get(
            url=agsi_config['api_endpoint'],
            params=params,
            headers=headers
        )

        body = response.json()
        if 'error' in body:
            raise ValueError(body['error'])

        last_page = body['last_page']
        all_data.extend(body['data'])

    last_day = all_data[0]

    all_countries_and_eu_data = _get_agsi_all_countries_and_eu_data(agsi_config=agsi_config)

    agsi_data = model.AGSIData(
        update_date=last_day['gasDayStart'],
        full_rate=last_day['full'],
        trend=last_day['trend'],
        max_storage_capacity=last_day['workingGasVolume'],
        max_storage_consumption=float(last_day['workingGasVolume']) / float(last_day['consumption']) * 100,
        france_historical_data={item['gasDayStart']: item['full'] for item in all_data[::-1]},
        all_countries_data=all_countries_and_eu_data[0],
        eu_full_rate=all_countries_and_eu_data[1]
    )

    # Perform some validation about the data before storing it!
    if _validate_agsi_data(agsi_data):
        with open(agsi_config['data_filename'], 'w') as outfile:
            outfile.write(agsi_data.json())
    else:
        logging.error('AGSI Data Validation failed. Data was not updated')


def _update_entsog_data():
    today = datetime.date.today()
    entsog_config = config.get_entsog_config(today)

    response = requests.get(
        url=entsog_config['api_endpoint'],
        params=entsog_config['query_params']
    )

    body = response.json()

    consumption_data: Dict[datetime.date, List[float]] = {}
    for item in body['aggregateddata']:
        date = datetime.datetime.strptime(item['periodFrom'], '%Y-%m-%dT%H:%M:%S%z').date()
        if date not in consumption_data:
            consumption_data[date] = []
        consumption_data[date] = consumption_data[date] + [item['value']]

    # Compute min and max nb values by date. It will be used to validate the data after that
    min_nb_values_by_date: int = min([len(item) for item in consumption_data.values()])
    max_nb_values_by_date: int = max([len(item) for item in consumption_data.values()])
    # Flatten values using sum
    consumption_data: Dict[datetime.date, float] = {key: sum(values) for key, values in consumption_data.items()}

    max_date = max(consumption_data.keys())
    current_year = datetime.date.today().year

    last_year_consumption_at_date = {
        str(k): v
        for k, v in consumption_data.items()
        if k <= max_date - dateutil.relativedelta.relativedelta(years=1)
    }

    current_year_consumption = {
        str(k): v
        for k, v in consumption_data.items()
        if k.year == current_year
    }

    yoy_growth = sum(current_year_consumption.values()) / sum(last_year_consumption_at_date.values()) - 1 \
        if sum(last_year_consumption_at_date.values()) - 1 > 0 \
        else 0

    entsog_data = model.ENTSOGData(
        update_date=max_date,
        last_consumption=consumption_data[max_date],
        yoy_growth=yoy_growth,
        current_year_consumption_time_series=current_year_consumption,
        last_year_consumption_time_series=last_year_consumption_at_date
    )

    # Perform some validation about the data before storing it!
    if _validate_entsog_data(min_nb_values_by_date, max_nb_values_by_date, entsog_data):
        with open(entsog_config['data_filename'], 'w') as outfile:
            outfile.write(entsog_data.json())
    else:
        logging.error('ENTSOG Data Validation failed. Data was not updated')


if __name__ == '__main__':
    try:
        _update_agsi_data()
    except ValueError as e:
        logging.error(f'Unable to get AGSI data: {e}')
    _update_entsog_data()
