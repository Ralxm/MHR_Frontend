import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FileDropZone = ({ onDrop, accept, maxSize, disabled, handleRemoveFile, multiple = true }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setUploadedFiles(prev => [...prev, ...acceptedFiles]);
                onDrop(acceptedFiles);
            }
        },
        accept,
        maxSize,
        disabled,
        multiple
    });

    const _handleRemoveFile = (index) => {
        if(!disabled){
            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
        }  
    };

    return (
        <Box>
            {!disabled &&
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    padding: 2,
                    textAlign: 'center',
                    backgroundColor: isDragActive ? '#f0f0f0' : '#fff',
                    cursor: 'pointer',
                }}
            >
                <input {...getInputProps()} />
                <Typography>
                    {isDragActive
                        ? 'Solte o anexo aqui...'
                        : 'Arraste e solte o anexo aqui, ou clique para escolher'}
                </Typography>
            </Box>
            }

            {/* Mostrar os anexos que foram enviados */}
            {uploadedFiles && uploadedFiles.map((file, index) => (
                <Box
                    key={index}
                    sx={{
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        padding: 1,
                    }}
                >
                    <Typography variant="body2">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                    </Typography>
                    <IconButton onClick={() => {handleRemoveFile(index); _handleRemoveFile(index)}} size="small">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
};

export default FileDropZone;