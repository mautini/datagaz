import datetime
import json

from fastapi import FastAPI
from fastapi.responses import Response
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from starlette.status import HTTP_200_OK

import config
import model

app = FastAPI()

origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DataResponse(BaseModel):
    agsi_data: model.AGSIData
    entsog_data: model.ENTSOGData


class Contact(BaseModel):
    first_name: str
    last_name: str
    phone: str
    mail: str
    reason: str
    title: str
    message: str


@app.get('/')
def home():
    return Response(status_code=HTTP_200_OK)


@app.get('/data', response_model=DataResponse)
def data():
    with open(config.entsog['data_filename'], 'r') as input_file:
        entsog_data = json.load(input_file)

    with open(config.agsi['data_filename'], 'r') as input_file:
        agsi_data = json.load(input_file)

    return DataResponse(
        agsi_data=agsi_data,
        entsog_data=entsog_data
    )


@app.post('/contact')
def mail(contact: Contact):
    with(open(f'./contact_{datetime.datetime.now()}', 'w+', encoding='utf-8')) as file:
        file.write(contact.json())
