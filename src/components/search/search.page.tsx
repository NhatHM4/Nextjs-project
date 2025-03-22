'use client'
import { convertToSlug, sendRequest } from '@/utils/api';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
const SearchPage = () => {

    const params = useSearchParams();
    const query = params.get('q');
    const [filteredResults, setFilteredResults] = useState<ITrackTop[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
                method: 'POST',
                body: {
                    current: 1,
                    pageSize: 100,
                    title: query,
                },
            });
            if (res.data) {
                setFilteredResults(res?.data?.result);
            }

        }
        fetchData();

        if (query) {
            document.title = `"${query}" trên NhatHM4`;
        }

    }, [query]);




    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {/* Thanh tìm kiếm */}
            <Typography variant="h5" gutterBottom>
                Kết quả tìm kiếm cho khóa: {query}
            </Typography>

            {/* Dropdown kết quả tìm kiếm */}
            {filteredResults.length > 0 && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        mt: 1,
                        maxHeight: 300,
                        overflowY: 'auto',
                    }}
                >
                    <List>
                        {filteredResults.map((track, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt={track.title} />
                                </ListItemAvatar>
                                <Link href={`/track/${convertToSlug(track.title)}-${track._id}.html?audio=${track.trackUrl}`} style={{ textDecoration: 'none', color: 'inherit' }}>{track.title}
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default SearchPage;
