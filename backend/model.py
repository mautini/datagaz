import datetime
from typing import Dict

from pydantic import BaseModel


class AGSIData(BaseModel):
    update_date: str
    full_rate: float
    trend: float
    max_storage_capacity: float
    max_storage_consumption: float
    france_historical_data: Dict[str, float]
    all_countries_data: Dict[str, float]
    eu_full_rate: float


class ENTSOGData(BaseModel):
    update_date: datetime.date
    last_consumption: float
    yoy_growth: float
    current_year_consumption_time_series: Dict[str, float]
    last_year_consumption_time_series: Dict[str, float]
