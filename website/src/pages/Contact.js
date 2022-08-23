import * as React from "react";
import {Alert, AlertTitle, Button, Collapse, Grid, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";

const reasons = [
    {
        id: '1',
        label: 'Bug / proposition / remarque sur le site'
    },
    {
        id: '2',
        label: 'Question relative aux données présentées'
    },
    {
        id: '3',
        label: 'Contact presse'
    },
    {
        id: '4',
        label: 'Question concernant les données personnelles'
    },
    {
        id: '5',
        label: 'Autre'
    }
]

export default function Contact() {
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const form = useForm();

    return (
        <FormContainer
            formContext={form}
            onSuccess={data => {
                setOpenSuccess(false)
                setOpenError(false)
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        first_name: data.firstName,
                        last_name: data.lastName,
                        phone: data.phone,
                        mail: data.mail,
                        reason: reasons[data.reason].label,
                        title: data.title,
                        message: data.message
                    })
                };
                fetch('https://api.datagaz.fr/contact', requestOptions)
                    .then(response => {
                        if(response.status === 200) {
                            setOpenSuccess(true)
                            form.reset()
                        } else {
                            setOpenError(true)
                        }
                    })
                    .catch(response => setOpenError(true))
            }}
        >
            <Grid container spacing={2} sx={{mb: 8}}>
                <Grid item xs={12} md={6}>
                    <TextFieldElement name='firstName' label={'Prénom'} required fullWidth
                                      validation={{required: 'Ce champ est obligatoire'}}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextFieldElement name='lastName' label={'Nom'} required fullWidth
                                      validation={{required: 'Ce champ est obligatoire'}}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextFieldElement name='phone' label={'Téléphone'} type={'tel'} fullWidth/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextFieldElement name='mail' label={'Email'} type={'email'} required fullWidth
                                      validation={{required: 'Ce champ est obligatoire'}}/>
                </Grid>
                <Grid item xs={12}>
                    <SelectElement
                        label='Objet'
                        name='reason'
                        fullWidth
                        options={reasons}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextFieldElement name='title' label={'Titre du message'} required fullWidth
                                      validation={{required: 'Ce champ est obligatoire'}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextFieldElement name='message'
                                      label={'Votre Message'}
                                      multiline
                                      required
                                      fullWidth
                                      rows={6}
                                      validation={{required: 'Ce champ est obligatoire'}}/>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={openSuccess}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpenSuccess(false);
                                    }}>
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            <AlertTitle>Message envoyé !</AlertTitle>
                        </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={openError}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpenError(false);
                                    }}>
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                            severity="error"
                        >
                            <AlertTitle>Erreur lors de l'envoi du message, réessayez !</AlertTitle>
                        </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <Button type={'submit'} variant={'contained'} color={'primary'} fullWidth endIcon={<SendIcon />}>
                        Envoyer
                    </Button>
                </Grid>
            </Grid>
        </FormContainer>
    )
}