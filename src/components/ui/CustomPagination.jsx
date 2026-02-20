import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function CustomPagination({ count, page, onChange, size = "medium", showText = true }) {
    if (!count || count <= 0) return null;

    return (
        <Stack spacing={showText ? 2 : 0} alignItems="center" sx={{ py: showText ? 3 : 0, width: showText ? '100%' : 'auto' }}>
            {showText && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    PAGE {page} OF {count}
                </Typography>
            )}
            <Pagination
                count={count}
                page={page}
                onChange={onChange}
                color="primary"
                shape="rounded"
                variant="outlined"
                size={size}
            />
        </Stack>
    );
}
