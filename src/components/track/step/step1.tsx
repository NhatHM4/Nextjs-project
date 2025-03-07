'use-client';
import React, { useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import '../upload.scss';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSession } from 'next-auth/react';
import axios from 'axios';



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
function InputFileUpload() {
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

interface IProps {
    setValue: (value: number) => void,
    setAudio: any
}

const Step1 = ({ setValue, setAudio }: IProps) => {
    const { data: session } = useSession();
    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        setValue(1);
        if (acceptedFiles && acceptedFiles.length > 0) {
            const audio = acceptedFiles[0]
            const formData = new FormData();
            formData.append('fileUpload', audio)
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`
                    , formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${session?.access_token}`,
                        'target_type': 'tracks'
                    },
                    onUploadProgress: (progressEvent: any) => {
                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                        // do whatever you like with the percentage complete
                        // maybe dispatch an action that will update a progress bar or something
                        setAudio({
                            fileName: audio.name,
                            percent: percentCompleted,
                            uploadedTrackName: ''
                        })
                    }
                });
                setAudio((prevState: any) => ({
                    ...prevState,
                    uploadedTrackName: res.data.data.fileName
                }))
            } catch (error) {
                console.log(error);

            }

        }
    }, [session])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "audio/*": [".mp3"]
        }
    });
    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

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
