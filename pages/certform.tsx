// ** React Imports
import { forwardRef, useState } from 'react'

import type { NextPage } from 'next'
import { TextField, Button, MenuItem, Typography} from '@mui/material'
import { Paper, Card, CardHeader, CardContent, CardActions, Grid, Table, TableHead, TableBody, TableRow, TableCell, TableContainer  } from '@mui/material'
import { Box } from '@mui/system';

// ** Third Party Imports
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import DatePicker from 'react-datepicker';
// import { format } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Styled Component
import DatePickerWrapper from '@core/styles/libs/react-datepicker'

// eslint-disable-next-line react/display-name
const CustomExamDateInput = forwardRef((props, ref) => {
    return <TextField {...props} inputRef={ref} label='examDate' autoComplete='off' />
  })

const CertForm: NextPage = () => {
    // ** States
    const [date, setDate] = useState<Date | null | undefined>(null)

    // ** yup schema
    const validationSchema = yup.object().shape({
        certformItems: yup.array().of(yup.object().shape(
            {
                // examDate: yup.date().nullable(), //.required("examDate_IsRequired"),
                // examScore: yup.string().oneOf(["1","2","3"]),
                examComment: yup.string().when("examScore", {is: "1", then: yup.string().required("examComment_IsRequired")})
            }
        )),
        // superConfirmComment: yup.string().required("superConfirmComment_IsRequired")
    });

    type CertformItem = {
        itemId: string, 
        itemName: string, 
        examDate?: string|null, 
        examScore?: string, 
        examComment?: string, 
        examTimestamp?: Date,
    };

    type Certform = {
        certformItems: CertformItem[],
        superConfirmComment?: string,
    }

    // type SuperCertform = Certform & {
    //     superConfirmComment?: string,
    //     superConfirmTimestamp?: Date,
    // }

    const examScoreOptions = [
        {label: "1", value: "1"},
        {label: "2", value: "2"},
        {label: "3", value: "3"},
    ]

    const defaultValues: Certform = {
        certformItems: [
            { itemId: "id_awwgxf", itemName: "itemNameLuo", examDate: null, examScore: "1", examComment: "111111", },
            { itemId: "id_xxsdfx", itemName: "itemNameOaa", examDate: null, examScore: "", examComment: "", },
        ],
        superConfirmComment: "",
    }

    const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });

    const {
      fields,
      append,
      prepend,
      remove,
      swap,
      move,
      insert,
      replace
    } = useFieldArray({
      control,
      name: "certformItems"
    });

    const onSubmit = (data:any) => console.log("data", data,);
    const onErrors = (errors:any) => console.log("errors", errors);

    return (
        <Paper>
            <CardHeader title='ThisIsCardHeader' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>itemId</TableCell>
                                        <TableCell>itemName</TableCell>
                                        <TableCell>examDate</TableCell>
                                        <TableCell>examScore</TableCell>
                                        <TableCell>examComment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((x, idx) => {
                                        return (<TableRow key={idx}>
                                            <TableCell>{x.itemId}</TableCell>
                                            <TableCell>{x.itemName}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`certformItems.${idx}.examDate`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePickerWrapper>
                                                            <DatePicker
                                                                todayButton="Today"
                                                                selected={field.value}
                                                                dateFormat='yyyy-MM-dd'
                                                                maxDate={new Date()}
                                                                placeholderText='YYYY-MM-DD'
                                                                customInput={<CustomExamDateInput />}
                                                                {...field} 
                                                            />
                                                        </DatePickerWrapper>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`certformItems.${idx}.examScore`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField 
                                                            label="examScore"
                                                            select
                                                            {...field}
                                                        >
                                                            <MenuItem key="init" value="" disabled>(請選擇)</MenuItem>
                                                            {examScoreOptions.map(o => 
                                                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                                            )}
                                                        </TextField>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`certformItems.${idx}.examComment`}
                                                    control={control}
                                                    render={({ field }) => <TextField 
                                                        label="examComment" {...field} fullWidth
                                                        error={!!(errors?.certformItems?.[idx]?.examComment)}
                                                        helperText={errors?.certformItems?.[idx]?.examComment?.message}
                                                    />}
                                                />
                                            </TableCell>
                                        </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            {/* <TextField label="superConfirmComment" multiline rows={3} sx={{ width: "100%"}} /> */}
                            <Controller
                                name={`superConfirmComment`}
                                control={control}
                                render={({ field }) => (
                                    <TextField 
                                        label="superConfirmComment" 
                                        multiline rows={3} 
                                        sx={{ width: "100%"}}  
                                        {...field} 
                                        error={!!errors.superConfirmComment}
                                        helperText={errors?.superConfirmComment?.message}
                                    />
                                )}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button variant='contained' onClick={handleSubmit(onSubmit, onErrors)}>SUBMIT</Button>
                <Button variant='outlined' onClick={()=>{reset();}}>CANCEL</Button>
            </CardActions>
        </Paper>
    )
};

export default CertForm


// https://www.thisdot.co/blog/how-to-create-reusable-form-components-with-react-hook-forms-and-typescript
// https://react-hook-form.com/api/usefieldarray/
// https://codesandbox.io/s/react-hook-form-usefieldarray-ssugn?file=/src/index.js:1222-1393
// https://blog.logrocket.com/using-material-ui-with-react-hook-form/
// https://pjchender.dev/react/note-react-hook-form/
