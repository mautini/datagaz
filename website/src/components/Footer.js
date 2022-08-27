import {Link, Stack, Typography} from "@mui/material";
import * as React from "react";

export default function Footer() {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{m: 2}}
            spacing={2}>
            <Typography align={'center'} variant={'caption'}>
                Copyright © 2022 - Tous droits réservés.
            </Typography>
            <Stack direction={'row'}>
                <Link
                    href='/contact'
                    underline='hover'
                    variant={'caption'}
                    sx={{mr: 4}}>
                    Contact
                </Link>
                <Link
                    href='/mentions-legales'
                    underline='hover'
                    align="center"
                    variant={'caption'}
                    sx={{mr: 4}}
                >
                    Mentions légales
                </Link>
                <Link
                    href='https://github.com/mautini/datagaz'
                    underline='hover'
                    align='center'
                    variant={'caption'}>
                    Code source
                </Link>
            </Stack>
        </Stack>
    )
}