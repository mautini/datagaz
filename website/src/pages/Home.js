import * as React from "react";
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Link,
    Stack,
    Typography
} from "@mui/material";
import AtAGlance from "../components/AtAGlance";
import ConsumptionChart from "../components/ConsumptionChart";
import StorageChart from "../components/StorageChart";
import MapChart from "../components/MapChart";

const DATA_URL = 'https://api.datagaz.fr/data'

export default function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(DATA_URL)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(_ => setError(true))
    }, [error])

    if (error) {
        return (<Stack alignItems={'center'}>
                <Typography sx={{mb: 2}}>Erreur lors de la récupération des données</Typography>
                <Button variant={'contained'} sx={{mb: 8}} onClick={() => setError(false)}>Réessayer</Button>
            </Stack>
        )
    }

    if (data === null) {
        return (
            <Stack alignItems={'center'}>
                <CircularProgress sx={{mb: 2}}></CircularProgress>
                <Typography sx={{mb: 8}}>Chargement des données</Typography>
            </Stack>
        )
    }

    return (
        <Box>
            <Typography variant="h4" component="div" gutterBottom>
                Tableau de bord sur le gaz, en France et en Europe.
            </Typography>
            <Typography sx={{mb: 4}}>
                Data Gaz vous permet de suivre et de visualiser un ensemble d'indicateurs concernant la consommation,
                production et stockage de gaz en France et en Europe. Les données sont mises à jour quotidiennement,
                sous réserve de disponibilité auprès des sources.
            </Typography>
            <Typography variant="caption" display="block" mb={4}>
                Dernière mise à jour des données AGSI : {data.agsi_data.update_date}<br/>
                Dernière mise à jour des données ENTSOG : {data.entsog_data.update_date}
            </Typography>
            <Typography variant="h4" component="div">
                Chiffres clés
            </Typography>
            <AtAGlance data={data}/>
            <Typography variant="h4" component="div" mb={2} mt={6}>
                En détails
            </Typography>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                    <Card sx={{p: 2}}>
                        <CardHeader sx={{p: 2}} title={'Consommation journalière en France'}>
                        </CardHeader>
                        <CardContent>
                            <ConsumptionChart data={data}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Card sx={{p: 2}}>
                        <CardHeader sx={{p: 2}} title={'Evolution du taux de remplissage en France'}>
                        </CardHeader>
                        <CardContent>
                            <StorageChart data={data}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography variant="h4" component="div" mb={2} mt={4}>
                En Europe
            </Typography>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                    <MapChart data={data}/>
                </Grid>
            </Grid>
            <Typography variant="h4" component="div" mb={2} mt={4}>
                Les données utilisées
            </Typography>
            <Typography gutterBottom mb={4} component={'div'}>
                <ul>
                    <li>
                        Les données concernant le stockage de gaz proviennent de
                        l'<Link href={'https://agsi.gie.eu/'}>AGSI</Link> (Aggregated Gas Storage Inventory)
                        et sont fournies par GIE (Gas infrastructure Europe).
                    </li>
                    <li>
                        Les données concernant la consommation proviennent de l'<Link
                        href={'https://www.entsog.eu/'}>ENTSOG</Link> (European
                        Network of Transmission System Operators for Gas)
                    </li>
                    <br/>
                    Pour toute question ou précision sur les données utilisées, vous pouvez utiliser le lien vers
                    le formulaire de contact ci-dessous. Merci aussi de me faire remonter toutes les erreurs que
                    vous pourriez trouver dans les données : bien que je m'efforce à vérifier la qualité de
                    celles-ci, le système de l'ENTSOG est extrêmement complexe et il est possible que je passe à
                    côté de certaines subtilités.
                </ul>
            </Typography>
        </Box>
    )
}