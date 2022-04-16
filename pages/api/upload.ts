import { NextApiRequest, NextApiResponse } from "next";
import nc from 'next-connect';
import multer from 'multer';
import { read, write, utils } from 'xlsx';

interface MulterRequest extends Request {
    file: any;
}

const upload = multer({
    // storage: multer.diskStorage({
    //     destination: '/tmp/uploads',
    //     filename: (req, file, cb) => cb(null, file.originalname),
    // }),
});
  
const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
.use(upload.single('theFiles'))
.post((req: MulterRequest, res) => {
    try { 
        //console.log(req.file.buffer);
        //console.log(req.file); // { fieldname, originalname, encoding, mimetype, buffer, size }
        const workbook = read(req.file.buffer);
        const sheetNameList = workbook.SheetNames;
        console.log(`sheetNameList = `, sheetNameList);
        const excelData = utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
        res.status(200).json({ data: 'success', size: req.file.size, excelData});
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: 'fail'});
    }
});

export default handler;
  
export const config = {
    api: {
        bodyParser: false,
    },
};