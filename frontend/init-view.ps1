param(
    [Parameter(Mandatory=$true)]
    [string]$PageName,
    [string]$RootClassname,
    [string]$MainTSFilePath = ".\src\main.ts"  # Path to main.ts file, with default value
)

# Capitalize the first letter of the page name
$CapitalizedPageName = $PageName.Substring(0,1).ToUpper() + $PageName.Substring(1)

# Prompt for RootClassname if not provided
if (-not $RootClassname) {
    $RootClassname = Read-Host "Enter the RootClassname"
}

# Define the file paths
$TSFilePath = ".\src\views\$CapitalizedPageName.ts"
$SCSSFilePath = ".\src\styles\$PageName.scss"

# Function to check if file exists and prompt for replacement
function Test-FileExists {
    param([string]$FilePath)
    if (Test-Path $FilePath) {
        $response = Read-Host "File $FilePath already exists. Do you want to replace it? (Y/N)"
        if ($response -ne "Y" -and $response -ne "y") {
            Write-Host "Operation cancelled for $FilePath."
            return $false
        }
    }
    return $true
}

# Function to update main.ts with the new ViewHandler
function Update-MainTSFile {
    param([string]$FilePath, [string]$PageName, [string]$CapitalizedPageName)

    $importStatement = "import { ${PageName}ViewHandler } from './views/${CapitalizedPageName}';"
    $handlerStatement = "${PageName}ViewHandler"

    # Check if the import statement already exists
    if (-not (Select-String -Path $FilePath -Pattern $importStatement)) {
        Add-Content -Path $FilePath -Value "`n$importStatement"
        Write-Host "Added import statement to $FilePath."
    }

    # Insert the handler in the router array
    (Get-Content $FilePath) -replace '(const router = new Router\(\[)([^\]]*)', "`$1`$2, $handlerStatement" | Set-Content $FilePath
    Write-Host "Added view handler to the Router array in $FilePath."
}

# Check both files
if (-not (Test-FileExists -FilePath $TSFilePath) -or -not (Test-FileExists -FilePath $SCSSFilePath)) {
    exit
}

# Define the content of the TypeScript file
$TSFileContent = @"
import { QuarkFunction as `$, Quark } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import './../styles/$PageName.scss';

class ${CapitalizedPageName}View implements View {
  params: { type: string };

  constructor(params: { type: string }) {
    this.params = params;
  }

  render(q: Quark): void {
    `$(q, 'div', '$PageName $RootClassname', {}, (q) => {
      `$(q, 'span', '', {}, (q) => {
        q.innerHTML = '$CapitalizedPageName';
      });
    });
  }
}

export const ${PageName}ViewHandler = new ViewHandler('/$PageName', ${CapitalizedPageName}View);
"@

# Define the content of the SCSS file
$SCSSFileContent = @"
.$PageName.$RootClassname {
    span {
        background-color: red;
    }
}
"@

# Write the content to the files
Set-Content -Path $TSFilePath -Value $TSFileContent
Set-Content -Path $SCSSFilePath -Value $SCSSFileContent

Write-Host "File $TSFilePath has been created successfully."
Write-Host "File $SCSSFilePath has been created successfully."

# Update the main.ts file
Update-MainTSFile -FilePath $MainTSFilePath -PageName $PageName -CapitalizedPageName $CapitalizedPageName
