param([string]$file)
# Replace all leading 'pick' with 'reword' in the rebase todo so git will prompt for each commit message
$content = Get-Content -Raw -LiteralPath $file
$content = [regex]::Replace($content, '(?m)^\s*pick\b', 'reword')
Set-Content -LiteralPath $file -Value $content -Encoding UTF8
