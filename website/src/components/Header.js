import {Link, Typography, useTheme} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import * as React from "react";

export default function Header() {
    const theme = useTheme();

    return (
        <Link component={RouterLink}
              to={'/'}
              underline='none'
              color={theme.palette.text.primary}
              sx={{display: 'flex', alignItems: 'center', width: 'fit-content'}}
              mb={8}
        >
            <GasMeterIcon fontSize={'large'} sx={{mr: 1}}/>
            <Typography variant={'h3'}>Data Gaz</Typography>
        </Link>
    )
}