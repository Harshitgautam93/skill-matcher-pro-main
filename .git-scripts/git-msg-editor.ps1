param([string]$file)
# Remove any case-insensitive occurrences of 'lovable', 'lovable.dev', and 'lovable-tagger' from commit messages
$txt = Get-Content -Raw -LiteralPath $file
# Remove the patterns, replace with single space to avoid word concatenation
$txt = [regex]::Replace($txt, '(?i)lovable(?:\.dev)?|lovable-tagger', ' ')
# Normalize whitespace and trim
$txt = $txt -replace '[ \t]{2,}', ' '
$txt = $txt.Trim()
# Ensure message ends with a newline
if (-not $txt.EndsWith("`n")) { $txt = $txt + "`n" }
Set-Content -LiteralPath $file -Value $txt -Encoding UTF8
