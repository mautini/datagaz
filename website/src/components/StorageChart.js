import {Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
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
                    title={'Taux de remplissage'}
                    titleTypographyProps={{variant: 'h6'}}
                    sx={{p: 2, pb: 0}}
                >
                </CardHeader>
                <CardContent sx={{px: 2, py: 0}}>
                    <Typography>
                        {payload[0].payload.raw_date + ' : ' + payload[0].value.toFixed(2) + '%'}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return null;
};

function StorageChart({data}) {
    const theme = useTheme();
    moment.locale('fr')

    const france_historical_data = data.agsi_data.france_historical_data

    const chart_data = Object.entries(france_historical_data).map(
        ([key, value]) => {
            const month = new Date(key).toLocaleString('fr', {month: 'long'});
            return ({
                name: capitalizeFirstLetter(month) + ' ' + key.slice(0, 4),
                full: value,
                raw_date: key.slice(8, 10) + '/' + key.slice(5, 7) + '/' + key.slice(0, 4)
            })
        }
    )

    const years = new Set(Object.keys(france_historical_data).map(key => key.slice(0, 4)))
    const ticks = []
    years.forEach(year => {
        moment.months().map(capitalizeFirstLetter).forEach(month => {
                ticks.push(month + ' ' + year)
            }
        )
    })

    return (
        <ResponsiveContainer aspect={4.0 / 3.0} width='100%'>
            <AreaChart data={chart_data}>
                <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.primary}
                    ticks={ticks}
                />
                <YAxis
                    label={{
                        value: '%',
                        angle: -90,
                        position: 'insideLeft',
                        fill: theme.palette.text.primary,
                    }}
                    stroke={theme.palette.text.primary}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend/>
                <Area
                    type="monotone"
                    name="Taux de remplissage"
                    dataKey="full"
                    stroke={theme.palette.primary.main}
                    dot={null}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default StorageChart