"""FastAPI server for PDF to Word conversion."""

from pathlib import Path

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse, Response
from fastapi.staticfiles import StaticFiles

from converter import pdf_to_docx

STATIC_DIR = Path(__file__).parent / "static"
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB
PDF_MAGIC = b"%PDF"

app = FastAPI(title="PDF to Word Converter")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException):
    """Return plain-text error messages for the upload UI."""
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return PlainTextResponse(content=detail, status_code=exc.status_code)


@app.get("/")
def index():
    """Serve the upload UI."""
    return FileResponse(STATIC_DIR / "index.html")


def _validate_pdf(file: UploadFile, content: bytes) -> None:
    """Raise HTTPException if the upload is not a valid PDF within size limits."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File exceeds the 25 MB size limit.",
        )

    if not content.startswith(PDF_MAGIC):
        raise HTTPException(status_code=400, detail="Invalid PDF file.")


@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    """Accept a PDF upload and return a converted DOCX file."""
    content = await file.read()
    _validate_pdf(file, content)

    try:
        docx_bytes = pdf_to_docx(content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Conversion failed. Please try a different PDF.",
        )

    stem = Path(file.filename).stem or "converted"
    filename = f"{stem}.docx"

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
