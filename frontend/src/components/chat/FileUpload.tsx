import React, { useState, useRef } from 'react';
import { Button, Upload, message, Progress, Space, Typography } from 'antd';
import {
    PaperClipOutlined,
    FileOutlined,
    PictureOutlined,
    VideoCameraOutlined,
    AudioOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Text } = Typography;

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
    maxSize?: number; // MB
    allowedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    disabled = false,
    maxSize = 10, // 10MB
    allowedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*']
}) => {
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        // 检查文件大小
        if (file.size > maxSize * 1024 * 1024) {
            message.error(`File size must be less than ${maxSize}MB`);
            return;
        }

        // 检查文件类型
        const isValidType = allowedTypes.some(type => {
            if (type.endsWith('/*')) {
                const baseType = type.split('/')[0];
                return file.type.startsWith(baseType + '/');
            }
            return file.type === type;
        });

        if (!isValidType) {
            message.error('File type not allowed');
            return;
        }

        setUploading(true);

        // 模拟上传过程
        setTimeout(() => {
            setUploading(false);
            onFileSelect(file);
            message.success(`${file.name} selected`);
        }, 1000);
    };

    const uploadProps: UploadProps = {
        fileList,
        beforeUpload: (file) => {
            handleFileSelect(file);
            return false; // 阻止自动上传
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        disabled: disabled || uploading,
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
            showDownloadIcon: false,
        },
        accept: allowedTypes.join(','),
        multiple: false,
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <PictureOutlined />;
        if (type.startsWith('video/')) return <VideoCameraOutlined />;
        if (type.startsWith('audio/')) return <AudioOutlined />;
        return <FileOutlined />;
    };

    return (
        <div className="file-upload-container">
            <Upload {...uploadProps} className="file-upload">
                <Button
                    type="text"
                    icon={<PaperClipOutlined />}
                    disabled={disabled || uploading}
                    className="file-upload-button"
                    title="Attach file"
                />
            </Upload>

            {uploading && (
                <div className="file-upload-progress">
                    <Progress
                        percent={50}
                        size="small"
                        status="active"
                        showInfo={false}
                    />
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                        Uploading...
                    </Text>
                </div>
            )}
        </div>
    );
};

export default FileUpload; 