import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import {useState} from "react";
import {Card, CardContent, CardHeader, Tooltip, useTheme} from "@mui/material";
import {scaleLinear} from "d3-scale";

const geoUrl =
    "/europe.json"


export default function MapChart({data}) {
    const theme = useTheme();
    const [content, setContent] = useState("");
    const full_data = data['agsi_data']['all_countries_data']

    const colorScale = scaleLinear()
        .domain([0, 100])
        .range([theme.palette.error.main, theme.palette.success.main]);

    return (
        <Card>
            <CardHeader sx={{p: 2}} title={'État des stocks européens'}>
            </CardHeader>
            <CardContent sx={{p: 0}}>
                <Tooltip title={content} followCursor={true} enterTouchDelay={0}>
                    <ComposableMap
                        projection="geoAzimuthalEqualArea"
                        projectionConfig={{
                            rotate: [-10.0, -53.0, 0],
                            scale: 1100
                        }}>
                        <Geographies geography={geoUrl}>
                            {({geographies}) =>
                                geographies.map((geo) => {
                                    const country_data = full_data[geo.properties.geounit]
                                    const tooltip_content = country_data ? country_data + '%' : 'Pas de données'
                                    return (
                                        <Geography key={geo.rsmKey}
                                                   fill={country_data ? colorScale(country_data) : theme.palette.grey.A700}
                                                   geography={geo}
                                                   onMouseEnter={() => {
                                                       setContent(`${geo.properties.geounit_fr}: ${tooltip_content}`);
                                                   }}
                                                   onMouseLeave={() => {
                                                       setContent("");
                                                   }}
                                                   style={{
                                                       default: {
                                                           outline: "none"
                                                       },
                                                       hover: {
                                                           outline: "none"
                                                       },
                                                       pressed: {
                                                           outline: "none"
                                                       }
                                                   }}
                                        />
                                    )
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </Tooltip>
            </CardContent>
        </Card>
    )
}