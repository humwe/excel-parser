import type { NextPage } from 'next'
import React, {useState} from 'react'
import axios from 'axios';

export interface IProps {
  acceptedFileTypes?: string;
  allowMultipleFiles?: boolean;
  label: string;
  onChange: (formData: FormData) => void;
  uploadFileName: string;
}

export const UiFileInputButton: React.FC<IProps> = (props) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const formData = new FormData();

    Array.from(event.target.files).forEach((file) => {
      formData.append(event.target.name, file);
    });

    props.onChange(formData);

    formRef.current?.reset();
  };

  return (
    <form ref={formRef}>
      <button type="button" onClick={onClickHandler}>
        {props.label}
      </button>
      <input
        accept={props.acceptedFileTypes}
        multiple={props.allowMultipleFiles}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type="file"
      />
    </form>
  );
};

UiFileInputButton.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
};

const Page: NextPage = () => {

  const [percentage, setPercentage] = useState(0);
  const [excelData, setExcelData] = useState({});
  
  const onChange = async (formData: any) => {
    setPercentage(0);
    const axiosConfig = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const {loaded, total} = progressEvent;
        const percent = Math.round((loaded * 100) / total);
        console.log(`Current progress:`, percent);
        if(percent <= 100) {
          setPercentage(percent);
        }
      },
    };

    const response = await axios.post('/api/upload', formData, axiosConfig);
    setExcelData(response?.data?.excelData);

    console.log('response', response?.data?.size);
  };

  return (
    <div>
      <UiFileInputButton label="Upload Excel File" uploadFileName="theFiles" onChange={onChange}/>
      Upload progress : {percentage}%
      <pre>{JSON.stringify(excelData)}</pre>
    </div>
  )
}

export default Page
