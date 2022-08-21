import {Box, Link, Typography} from "@mui/material";

export default function Legal() {
    return (
        <Box>
            <Typography variant="h2" component="div" align={'center'} gutterBottom sx={{mb: 8}}>
                Mentions légales
            </Typography>
            <Typography variant="body1" component="div" gutterBottom sx={{mb: 4}}>
                Les présentes conditions précisent les modalités d'utilisation du site TO_CHANGE. De par l'utilisation
                du présent site, l'utilisateur reconnaît avoir pris connaissance de ces conditions et les accepte de
                manière pleine et entière. Ces conditions sont susceptibles d'être modifiées à tout moment.
            </Typography>
            <Typography variant="h4" component="div" gutterBottom>
                Hébergement
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
                RCS Lille Métropole 424 761 419 00045<br/>
                Code APE 2620Z<br/>
                N° TVA : FR 22 424 761 419<br/>
                Siège social : 2 rue Kellermann - 59100 Roubaix - France<br/>
                +33 (0)8 99 70 17 61<br/>
            </Typography>
            <Link href={'http://www.ovh.com'}>www.ovh.com</Link><br/>
            <Typography variant="body1" component="div" gutterBottom sx={{my: 4}}>
                Cet hébergeur possède les informations personnelles à jour de l'auteur de ce site.
            </Typography>
            <Typography variant="h4" component="div" gutterBottom>
                Données Personnelles
            </Typography>
            <Typography variant="body1" component="div" gutterBottom sx={{mb: 4}}>
                Ce site ne stocke aucune donnée personnelle concernant les visiteurs du site. Il n'utilise par ailleurs
                aucun cookie autre que ceux qui seraient nécessaires au fonctionnement du site et aucune solution
                d'analytics.
            </Typography>
            <Typography variant="body1" component="div" gutterBottom sx={{my: 4}}>
                Pour toute question sur ces présentes conditions ou sur les données personnelles, vous pouvez utiliser
                la page de <Link href={"/contact"}>contact</Link>.
            </Typography>
        </Box>
    )
}