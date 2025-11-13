# Resume Upload Troubleshooting Guide

The resume upload feature has been completely overhauled with robust error handling and extensive logging. This guide helps you test and debug any issues.

## ✅ What Was Fixed

### Server-Side Improvements:
1. **Real PDF/DOCX parsing** - Using pdf-parse and mammoth libraries
2. **Comprehensive error handling** - Specific error messages for each failure type
3. **Extensive logging** - Every step is logged for debugging
4. **TXT file support** - Fallback option if PDF/DOCX fails
5. **File size validation** - 10MB maximum
6. **Lower text threshold** - Only 50 characters minimum (down from 100)

### Client-Side Improvements:
1. **Updated file input** - Accepts .pdf, .docx, .doc, .txt
2. **File size validation** - Checks before upload
3. **Better error messages** - More helpful feedback

## 🧪 Testing the Feature

### Step 1: Test with Sample Resume

A test resume has been created at `test-resume.txt`:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Login and navigate to Resume Check:**
   - Go to http://localhost:3000/resume-check
   - Upload `test-resume.txt`
   - Click "Analyze Resume"

3. **Expected result:**
   - File uploads successfully
   - Text is extracted (about 2,400 characters)
   - AI analysis is returned with ATS score, issues, suggestions

### Step 2: Test with Your Own Files

Try uploading different file types:

**✅ Supported formats:**
- `.pdf` - PDF documents
- `.docx` - Word 2007+ documents
- `.doc` - Older Word documents (may work)
- `.txt` - Plain text files (fallback)

**🚫 File requirements:**
- Maximum size: 10MB
- Minimum text: 50 characters
- Must not be password-protected (PDF)
- Must not be image-based (scanned PDF without OCR)

## 🔍 Debugging Steps

### Check Server Logs

The server now logs detailed information. Check your terminal/console for:

```
Processing file: resume.pdf Size: 245678 Type: application/pdf
Buffer created, size: 245678
Starting PDF extraction, buffer size: 245678
PDF parsed successfully, text length: 2456
Number of pages: 2
Text extracted, length: 2456
Text preview: John Doe Software Engineer...
```

### Common Errors and Solutions

#### Error: "Failed to extract text from PDF"

**Possible causes:**
1. **Image-based PDF** - Scanned document without OCR
   - **Solution:** Convert to Word (.docx) or run OCR on the PDF
   - **Alternative:** Copy-paste text into a .txt file

2. **Corrupted PDF** - File is damaged
   - **Solution:** Try re-exporting the PDF from Word/Google Docs
   - **Check:** Can you open the PDF normally in a PDF viewer?

3. **Encrypted/Password-protected PDF**
   - **Solution:** Remove password protection first
   - **Check:** Does the PDF ask for a password when opening?

4. **Empty PDF** - No text content
   - **Solution:** Ensure the PDF has actual text (not just images)

**Quick test:**
```bash
# Test if pdf-parse is working
node -e "const pdfParse = require('pdf-parse'); console.log('pdf-parse loaded successfully');"
```

#### Error: "Failed to extract text from DOCX"

**Possible causes:**
1. **Old .doc format** - Not .docx
   - **Solution:** Open in Word and save as .docx

2. **Corrupted file**
   - **Solution:** Re-save the document

3. **Empty document**
   - **Solution:** Ensure document has text content

**Quick test:**
```bash
# Test if mammoth is working
node -e "const mammoth = require('mammoth'); console.log('mammoth loaded successfully');"
```

#### Error: "Could not extract enough text (found X characters, need at least 50)"

**Causes:**
- File is mostly images
- Very short resume
- Parsing failed but didn't throw error

**Solutions:**
1. **Add more content** - Resume should be at least 50 characters
2. **Try .txt format** - Copy resume text and save as .txt
3. **Check the logs** - See what was actually extracted

#### Error: "File too large. Maximum size is 10MB"

**Solution:**
- Compress your PDF
- Remove high-resolution images
- Use online PDF compressor tools

## 📊 Verify Libraries Are Installed

```bash
# Check if libraries are installed
npm list pdf-parse mammoth

# Expected output:
# jobgyani@0.1.0 /home/user/jobgyani
# ├── mammoth@1.11.0
# └── pdf-parse@2.4.5
```

## 🔧 Manual Testing Script

Create a test file `test-upload.js`:

```javascript
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

async function testPDF() {
  try {
    console.log('Testing PDF parsing...');
    // Create a test PDF or use an existing one
    const dataBuffer = fs.readFileSync('./path-to-your-resume.pdf');
    const data = await pdfParse(dataBuffer);
    console.log('✅ PDF parsed successfully');
    console.log('Pages:', data.numpages);
    console.log('Text length:', data.text.length);
    console.log('Preview:', data.text.substring(0, 200));
  } catch (error) {
    console.error('❌ PDF parsing failed:', error.message);
  }
}

async function testDOCX() {
  try {
    console.log('\nTesting DOCX parsing...');
    const result = await mammoth.extractRawText({
      path: './path-to-your-resume.docx'
    });
    console.log('✅ DOCX parsed successfully');
    console.log('Text length:', result.value.length);
    console.log('Preview:', result.value.substring(0, 200));
  } catch (error) {
    console.error('❌ DOCX parsing failed:', error.message);
  }
}

testPDF();
testDOCX();
```

Run it:
```bash
node test-upload.js
```

## 💡 Best Practices

### For Users:
1. **Use .docx if PDF fails** - Word format is more reliable
2. **Ensure text is selectable** - If you can't select/copy text in the PDF, it won't work
3. **Keep files under 5MB** - Faster processing
4. **Use standard fonts** - Avoid unusual characters that might not parse

### For Developers:
1. **Check server logs** - All steps are logged
2. **Test with sample file** - Use the provided `test-resume.txt`
3. **Verify libraries** - Run `npm list pdf-parse mammoth`
4. **Check error messages** - They now provide specific guidance

## 🆘 Still Having Issues?

1. **Check the browser console** - Look for JavaScript errors
2. **Check the server logs** - Look for detailed error messages
3. **Try the test resume** - Use `test-resume.txt` to isolate the issue
4. **Verify file format:**
   ```bash
   file your-resume.pdf
   # Should show: PDF document, version X.X
   ```

5. **Check OpenAI API key** - Resume analysis requires OpenAI
   ```bash
   # In .env.local
   OPENAI_API_KEY=sk-...
   ```

## 📝 Supported File Types Summary

| Format | Extension | Status | Notes |
|--------|-----------|--------|-------|
| PDF | `.pdf` | ✅ Supported | Must be text-based, not scanned |
| Word (new) | `.docx` | ✅ Supported | Recommended format |
| Word (old) | `.doc` | ⚠️ Partial | Try converting to .docx |
| Plain Text | `.txt` | ✅ Supported | Fallback option |
| Image | `.jpg`, `.png` | ❌ Not supported | Convert to PDF with OCR first |

## 🎯 Quick Fixes

**If nothing works:**
1. Copy your resume text
2. Paste into a new text file
3. Save as `my-resume.txt`
4. Upload the .txt file

This bypasses all PDF/DOCX parsing issues and should always work!
