import { Box, Chip } from '@mui/material';

import { chipsContainer } from '../styles';

const ChipsContainer = ({ terms, selectedChip, handleChipClick }) => (
    <Box sx={chipsContainer}>
        {terms.map((term) => (
            <Chip
                variant={selectedChip === term.term ? 'filled' : 'outlined'}
                disabled={selectedChip === term.term}
                key={term.term}
                label={term.term}
                onClick={() => handleChipClick(term)}
                sx={{
                    margin: '5px',
                    transition: 'ease 0.5s',
                    backgroundColor: selectedChip === term.term
                        ? (theme) => theme.palette.primary.main
                        : 'inherit',
                    color: selectedChip === term.term
                        ? (theme) => theme.palette.primary.contrastText
                        : 'inherit',
                }}
            />
        ))}
    </Box>
);

export default ChipsContainer;
