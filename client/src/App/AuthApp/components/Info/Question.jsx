import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";

const Question = ({question, answer}) => {
    return (
        <Accordion style={{ direction: 'rtl' }}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
                {question}                
            </AccordionSummary>
            <AccordionDetails>
            {answer}
            </AccordionDetails>
        </Accordion>
    )
}

export default Question