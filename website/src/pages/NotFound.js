import {Button, Stack, SvgIcon, Typography, useTheme} from "@mui/material";

export default function NotFound() {
    const theme = useTheme()

    return (
        <Stack alignItems={'center'}>
            <Typography variant={'h1'} align={'center'} sx={{mb: 2}}>
                404 not found
            </Typography>
            <SvgIcon sx={{fontSize: theme.typography.h1.fontSize.toString(), mb: 8}}>
                <path
                    d="M11 8V5H7V3h10v2h-4v3ZM4 21v-8h2v1h3v-3H8V9h8v2h-1v3h3v-1h2v8h-2v-1H6v1Zm2-3h12v-2h-5v-5h-2v5H6Zm6 0Z"/>
            </SvgIcon>
            <Button size={'large'} variant={'contained'} href={'/'} sx={{mb: 4, width: 'fit-content'}}>
                Retourner en terrain connu
            </Button>
        </Stack>
    )
}