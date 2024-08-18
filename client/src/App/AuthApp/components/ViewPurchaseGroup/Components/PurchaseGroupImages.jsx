import { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PurchaseGroupImages = ({ images }) => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClickOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImage(null);
    };

    return (
        <Box>
            <Grid container spacing={1}>
                {images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box
                            component="img"
                            src={image}
                            alt={`property-image-${index}`}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: '4px',
                            }}
                            onClick={() => handleClickOpen(image)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth>
                <DialogContent>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <Box
                            component={'img'}
                            src={selectedImage}
                            alt={'property image'}
                            sx={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default PurchaseGroupImages;
