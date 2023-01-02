import {Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import * as React from "react";
import {Card, CardContent, CardHeader, Typography, useTheme} from "@mui/material";
import {capitalizeFirstLetter} from "../Utils";
import moment from "moment";
import 'moment/locale/fr'

const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <Card>
                <CardHeader
                    title={'Consumption'}
                    titleTypographyProps={{variant: 'h6'}}
                    sx={{p: 2, pb: 0}}
                >
                </CardHeader>
                <CardContent sx={{px: 2, py: 0}}>
                    <Typography>
                        {payload[0].payload.raw_date + '/' + payload[0].dataKey + ' : ' + payload[0].value.toFixed(2) + 'GWh'}
                        <br/>
                        {payload[1].payload.raw_date + '/' + payload[1].dataKey + ' : ' + payload[1].value.toFixed(2) + 'GWh'}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return null;
};

function ConsumptionChart({data}) {
    const theme = useTheme();
    moment.locale('fr')

    const current_year_data = data.entsog_data.current_year_consumption_time_series
    const last_year_data = data.entsog_data.last_year_consumption_time_series

    if (Object.entries(current_year_data).length < 1) {
        return (
            <Typography>Données insufisantes</Typography>
        )
    }

    const current_year = Object.keys(current_year_data)[0].slice(0, 4)

    const chart_data = Object.keys(current_year_data).map(
        key => {
            const last_year = current_year - 1
            const last_year_key = key.replace(current_year, last_year)
            const month = new Date(key).toLocaleString('fr', {month: 'long'});
            return ({
                name: capitalizeFirstLetter(month),
                current_year: current_year_data[key] / 1000 / 1000, // kWh to GWh
                last_year: last_year_data[last_year_key] / 1000 / 1000,
                raw_date: key.slice(8, 10) + '/' + key.slice(5, 7)
            })
        }
    )

    return (
        <ResponsiveContainer aspect={4.0 / 3.0} width='100%'>
            <LineChart data={chart_data}>
                <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.primary}
                    ticks={moment.months().map(capitalizeFirstLetter)}
                />
                <YAxis
                    label={{
                        value: 'GWh',
                        angle: -90,
                        position: 'insideLeft',
                        fill: theme.palette.text.primary,
                    }}
                    stroke={theme.palette.text.primary}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend/>
                <Line type="monotone" dataKey={current_year} stroke={theme.palette.primary.main} dot={null}/>
                <Line type="monotone" dataKey={current_year - 1} stroke={theme.palette.secondary.main} dot={null}/>
            </LineChart>
        </ResponsiveContainer>
    )
}

export default ConsumptionChart