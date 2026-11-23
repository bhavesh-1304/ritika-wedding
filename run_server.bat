@echo off
rem Simple local server starter (requires Python 3 installed and added to PATH)
set "PROJECT_DIR=%~dp0"
pushd "%PROJECT_DIR%"
python -m http.server 8000
popd
