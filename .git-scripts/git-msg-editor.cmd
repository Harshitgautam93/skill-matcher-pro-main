@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "$txt = Get-Content -Raw -LiteralPath '%1'; $txt = [regex]::Replace($txt, '(?i)lovable(?:\.dev)?|lovable-tagger', ' '); $txt = $txt -replace '[ \t]{2,}', ' '; $txt = $txt.Trim(); if (-not $txt.EndsWith("`n")) { $txt = $txt + "`n" }; Set-Content -LiteralPath '%1' -Value $txt -Encoding UTF8"
