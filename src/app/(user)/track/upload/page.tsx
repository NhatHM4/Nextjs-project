import UploadTab from "@/components/track/upload.tab";
import { Container } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Upload Page',
    description: 'This is the Upload page',
}

const UploadPage = () => {

    return (
        <Container>
            <UploadTab />
        </Container>
    );
}

export default UploadPage;
