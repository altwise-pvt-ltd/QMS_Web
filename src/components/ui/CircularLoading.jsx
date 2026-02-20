import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(props) {
    const { size = 40, ...other } = props;
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...other} size={size} thickness={5} sx={{ color: 'white' }} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'white', fontWeight: 'black', fontSize: size * 0.2 + 'px' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function CircularLoading({ loading, size = 30 }) {
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        let timer;
        if (loading) {
            timer = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
            }, 100);
        } else {
            setProgress(0);
        }
        return () => {
            clearInterval(timer);
        };
    }, [loading]);

    if (!loading) return null;

    return (
        <Box className="flex items-center justify-center">
            <CircularProgressWithLabel value={progress} size={size} />
        </Box>
    );
}
