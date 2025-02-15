'use-client';
import React, { useCallback, useEffect } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import './upload.scss';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios, { AxiosRequestConfig } from 'axios';
import { useSession } from 'next-auth/react';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
export function InputFileUpload() {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onClick={(event) => event?.preventDefault()}
        >
            Upload files
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
            />
        </Button>
    );
}


const Step1 = ({ setValue, setPercentCompleted }: { setValue: (newValue: number) => void, setPercentCompleted: (newValue: number) => void }) => {
    const session = useSession();
    const [accessToken, setAccessToken] = React.useState<string | null>(null);


    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        await uploadFile(acceptedFiles[0]);
    }, [accessToken])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop });
    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    useEffect(() => {
        if (session.status === "authenticated" && session?.data.access_token) {
            setAccessToken(session?.data.access_token);
        }
    }, [session]);


    const uploadFile = async (file: FileWithPath) => {


        if (!file) {
            alert("Please select a file first!");
            return;
        }
        if (!accessToken) {
            alert("Don't have access token!");
            return;
        }

        let config: AxiosRequestConfig<any> = {
            onUploadProgress: (progressEvent: any) => {
                const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
                console.log(percentCompleted);
                setValue(1);
                // do whatever you like with the percentage complete
                // maybe dispatch an action that will update a progress bar or something
            }
        }



        const formData = new FormData();
        formData.append("fileUpload", file);

        try {
            const response = await axios.post("http://localhost:8000/api/v1/files/upload",
                formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}`, "target_type": 'tracks' },
                onUploadProgress: config.onUploadProgress
            });

            console.log("Success:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };


    return (

        <section>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Step1;
