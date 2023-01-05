import * as React from 'react';
import {Card, CardContent, CardHeader, Grid, Link, Typography, useTheme} from "@mui/material";

function AtAGlance({data}) {
    const theme = useTheme()

    return (
        <Grid container spacing={2}>
            <Grid item lg={3} md={6} xs={12}>
                <Card sx={{m: 1, height: '100%'}}>
                    <CardHeader
                        title={data.agsi_data.full_rate + '%'}
                    >
                    </CardHeader>
                    <CardContent sx={{pt: 1}}>
                        <Typography sx={{mb: 2}}>
                            Taux de remplissage des sites de stockage
                        </Typography>
                        <Typography variant={'caption'} color={theme.palette.text.secondary}>
                            Dans l'Union européenne, les stocks sont remplis à {data.agsi_data.eu_full_rate}%.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
                <Card sx={{m: 1, height: '100%'}}>
                    <CardHeader
                        title={
                            (data.agsi_data.trend > 0 ? '+' : '') +
                            data.agsi_data.trend +
                            '%'
                        }
                        titleTypographyProps={{color: data.agsi_data.trend > 0 ? 'success.light' : 'error.light'}}
                    >
                    </CardHeader>
                    <CardContent sx={{pt: 1}}>
                        <Typography sx={{mb: 2}}>
                            Evolution du taux de remplissage
                        </Typography>
                        <Typography variant={'caption'} color={theme.palette.text.secondary}>
                            La capacité totale de stockage en France
                            représente {Math.round(data.agsi_data.max_storage_consumption)}% de sa consommation
                            annuelle (soit {Math.round(data.agsi_data.max_storage_capacity)} TWh).
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
                <Card sx={{m: 1, height: '100%'}}>
                    <CardHeader
                        // kWh to GWh
                        title={(data.entsog_data.last_consumption / 1000 / 1000).toFixed(2) + ' GWh'}
                    >
                    </CardHeader>
                    <CardContent sx={{pt: 1}}>
                        <Typography sx={{mb: 2}}>
                            Consommation journalière
                        </Typography>
                        <Typography variant={'caption'} color={theme.palette.text.secondary}>
                            L'année dernière, la consommation totale annuelle était de 479 TWh,
                            soit en moyenne 1314 GWh par jour.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
                <Card sx={{m: 1, height: '100%'}}>
                    <CardHeader
                        title={
                            (data.entsog_data.yoy_growth > 0 ? '+' : '') +
                            (data.entsog_data.yoy_growth * 100).toFixed(2) +
                            '%'
                        }
                        titleTypographyProps={{color: data.entsog_data.yoy_growth < 0 ? 'success.light' : 'error.light'}}
                    >
                    </CardHeader>
                    <CardContent sx={{pt: 1}}>
                        <Typography sx={{mb: 2}}>
                            Evolution de la consommation sur 1 an (glissant)
                        </Typography>
                        <Typography variant={'caption'} color={theme.palette.text.secondary}>
                            L'Union Européenne a fixé comme objectif une réduction de 15% sur la
                            période août 2022 - mars 2023 <Link
                            href={'https://ec.europa.eu/commission/presscorner/detail/en/IP_22_4608'}>(source)</Link>.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default AtAGlance;