"use client"
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Step1 from '@/components/track/step1';
import Step2 from '@/components/track/step2';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const UploadTab = () => {
    const [value, setValue] = React.useState(0);
    const [percentCompleted, setPercentCompleted] = React.useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: '100%', border: 1, borderColor: 'divider', marginTop: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Track" />
                    <Tab label="Basic Information" />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Step1 setValue={setValue} setPercentCompleted={setPercentCompleted} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Step2 percentCompleted={percentCompleted} />
            </CustomTabPanel>
        </Box>
    );
}

export default UploadTab;
