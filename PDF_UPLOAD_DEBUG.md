# PDF Upload Debugging Guide

## How to Debug PDF Upload Issues

If you're experiencing PDF upload errors, follow these steps:

### 1. Check Server Logs

When uploading a PDF, check your development server console for detailed logs:

```
Starting PDF extraction, buffer size: XXXXX
pdf-parse type: function
pdf-parse is function: true
PDF parsed successfully
Number of pages: X
Text length: XXXX
First 200 chars: [preview of extracted text]
```

### 2. Common PDF Issues

**Issue**: "No text content found in PDF"
- **Cause**: The PDF is image-based (scanned document) or uses non-standard encoding
- **Solution**:
  - Convert the PDF to DOCX using Microsoft Word or Google Docs
  - Or use OCR (Optical Character Recognition) to convert the scanned PDF to a text-based PDF
  - Try exporting your resume as a new PDF from your resume editor

**Issue**: "PDF is password-protected"
- **Cause**: The PDF file has password protection
- **Solution**: Remove password protection using Adobe Acrobat or a PDF editor

**Issue**: "Failed to extract text from PDF"
- **Cause**: The PDF might be corrupted or use an unsupported format
- **Solution**:
  - Re-save the PDF from the original source
  - Try converting to DOCX format
  - Verify the PDF opens correctly in a PDF reader

### 3. Test with a Known-Good PDF

To verify the system is working:
1. Create a simple resume in Google Docs or Microsoft Word
2. Export as PDF (File → Download → PDF)
3. Upload this test PDF to verify functionality

### 4. Supported Formats

- **PDF**: Text-based PDFs (not scanned images)
- **DOCX**: Microsoft Word 2007+ format (recommended)
- **DOC**: Older Word format
- **TXT**: Plain text (basic but always works)

### 5. Best Practices for Resume PDFs

For best compatibility:
- Export directly from Word/Google Docs as PDF
- Avoid using complex layouts with tables or columns
- Don't use password protection
- Ensure text is selectable (you can copy-paste text from the PDF)
- File size should be under 10MB

### 6. Alternative: Use DOCX Format

If PDF continues to fail, use DOCX format instead:
- DOCX files have higher success rates
- Better text extraction
- Preserves formatting information
- Upload the .docx file directly instead of converting to PDF

## Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Empty PDF buffer" | File is empty or corrupted | Re-save the PDF |
| "No text content found" | PDF is image-based | Convert to DOCX or use OCR |
| "Invalid or corrupted PDF" | PDF file structure is damaged | Re-export from source |
| "Password-protected" | PDF is encrypted | Remove password protection |
| "PDF parsing library error" | System issue | Try DOCX format instead |

## Technical Details

The system uses:
- **pdf-parse v1.1.1** for PDF text extraction
- **mammoth** for DOCX text extraction
- Supports up to 10MB file size
- Parses all pages in the document
- Cleans and normalizes extracted text
