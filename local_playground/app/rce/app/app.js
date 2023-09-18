const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const util = require('util');
// const tempfile = require('tempfile');

const fs = require('fs');
const fs2 = require('fs/promises');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  res.render('index', { 
    activeTab: 'home'
  });
});

app.get('/convert2image', (req, res) => {
  res.render('index', { 
    activeTab: 'convert2image',
    convertedImage: null
  });
});

app.post('/convert2image', upload.single('pdf'), (req, res) => {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    return res.status(400).send('Invalid PDF file');
  }

  const pdfBuffer = req.file.buffer;

  // Run Ghostscript as a child process
  const gsProcess = spawn('gs', [
    '-sDEVICE=jpeg',
    '-o', 'output.jpg',
    '-sstdout=%stderr',
    '-dBATCH',
    '-dNOPAUSE',
    '-q',
    '-',
  ]);

  gsProcess.stdin.write(pdfBuffer);
  gsProcess.stdin.end();

  gsProcess.on('exit', (code) => {
    if (code === 0) {
      const imageBuffer = fs.readFileSync('output.jpg');
      const convertedImage = imageBuffer.toString('base64');
      res.render('index', {
        activeTab: 'convert2image',
        convertedImage: convertedImage // Pass the converted image data
      });     
      // res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      // res.end(imageBuffer);
    } else {
      res.status(500).send('Conversion failed.');
    }
  });
});

app.get('/convert2pdf', (req, res) => {
  res.render('index', {
    activeTab: 'convert2pdf',
    convertedPDF: null // Initialize convertedPDF as null
  });
});

app.post('/convert2pdf', upload.single('psfile'), async (req, res) => {
  try {
    // if (!req.file || !req.file.mimetype !== 'application/postscript') {
    //   return res.status(400).send('Invalid PostScript file');
    // }

    const psBuffer = req.file.buffer;

    // // Create a temporary image file with the same name and extension
    // const originalExtension = path.extname(req.file.originalname);
    // const tempInputFilePath = tempfile(`${path.basename(req.file.originalname, originalExtension)}${originalExtension}`);
    // await fs.writeFile(tempPSFilePath, psBuffer);

    // Create a temporar file with a unique name
    const tempInputFilePath = path.join(__dirname, 'public', req.file.originalname);

    fs2.writeFile(tempInputFilePath, psBuffer);
    // fs.writeFileSync(tempInputFilePath, psBuffer);

    // Construct the Ghostscript command
    const outputPDFPath = path.join(__dirname, 'public', "output.pdf");
    const ghostscriptCommand = `gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sstdout=%stderr -sOutputFile=${outputPDFPath} ${tempInputFilePath}`;

    // Run the Ghostscript command using exec with async/await
    const execPromise = util.promisify(exec);
    const { stdout, stderr } = await execPromise(ghostscriptCommand);
    // const { stdout, stderr } = await exec(ghostscriptCommand);

    console.log('Ghostscript STDOUT:', stdout);
    console.error('Ghostscript STDERR:', stderr);

    // Process the output PDF and send the response
    const pdfBuffer = await fs2.readFile(outputPDFPath);
    // const pdfBuffer = fs.readFileSync(outputPDFPath);
    const convertedPDF = pdfBuffer.toString('base64');

    // // Clean up the temporary PS file and the output PDF
    await fs2.unlink(tempInputFilePath);
    await fs2.unlink(outputPDFPath);

    // Clean up the temporary image file, directory, and the output PDF
    // fs.unlinkSync(tempImageFilePath);
    // fs.rmdirSync(tempDir);
    // fs.unlinkSync(outputPDFPath);

    res.render('index', {
      activeTab: 'convert2pdf',
      convertedPDF: convertedPDF
    });

  } catch (error) {
  console.error('Error:', error);
  res.status(500).send('An error occurred.');
  }
});

const server = app.listen(3000, () => {
  console.log('Node.js server is running on port 3000');
});

server.timeout = 10000;