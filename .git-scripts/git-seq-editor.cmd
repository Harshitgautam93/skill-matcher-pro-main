@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Content -Raw -LiteralPath '%1') -replace '(?m)^\s*pick\b','reword' | Set-Content -LiteralPath '%1'"
