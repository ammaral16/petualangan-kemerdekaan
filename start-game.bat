@echo off
title Petualangan Menuju Kemerdekaan Indonesia
color 0C
echo ==============================================================
echo    PETUALANGAN MENUJU KEMERDEKAAN INDONESIA - SERVER LOKAL
echo ==============================================================
echo.
echo Menjalankan web server lokal pada port 8080...
echo Membuka browser default di http://localhost:8080 ...
echo.
echo Tekan Ctrl+C di jendela ini untuk menghentikan server.
echo.

start "" "http://localhost:8080"
python -m http.server 8080
pause
