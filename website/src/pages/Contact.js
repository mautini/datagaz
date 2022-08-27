import * as React from "react";
import {Alert, AlertTitle, Button, Collapse, Grid, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";

const formUrl = 'https://api.datagaz.fr/contact'

const domParser = new DOMParser();

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

function getFormId(html) {
    const doc = domParser.parseFromString(html, "text/html");
    const formBuildIds = doc.getElementsByName('form_build_id');
    if (formBuildIds.length === 1) {
        const formBuildId = formBuildIds[0]
        if (formBuildId.hasAttribute('value')) {
            console.log(formBuildId)
            return formBuildId.getAttribute('value')
        }
    }
}

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
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({
                        'submitted[new_1661366981220]': data.firstName,
                        'submitted[new_1661366998814]': data.lastName,
                        'submitted[new_1661367027190]': data.phone,
                        'submitted[new_1661367044734]': data.mail,
                        'submitted[new_1661367036482]': reasons[data.reason - 1].label,
                        'submitted[new_1661367069570]': data.title,
                        'submitted[new_1661367082271]': data.message,
                    })
                };
                fetch(formUrl, requestOptions)
                    .then(response => {
                        if(response.status === 200) {
                            return response.text();
                        } else {
                            setOpenError(true)
                        }
                    })
                    .then(html => {
                        const formBuildId = getFormId(html)
                        if (!formBuildId) {
                            throw new Error('Unable to get the form id')
                        }
                        const requestOptions = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            body: new URLSearchParams({
                                'form_build_id': formBuildId,
                                'op': 'Soumettre'
                            })
                        };
                        fetch(formUrl, requestOptions)
                            .then(response => {
                                if(response.status === 200) {
                                    setOpenSuccess(true)
                                    form.reset()
                                } else {
                                    setOpenError(true)
                                }
                            })
                            .catch(_ => setOpenError(true))
                    })
                    .catch(_ => setOpenError(true))
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