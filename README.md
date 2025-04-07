
Secret Santa App

Features

1. Upload current year’s employee list from an Excel (.xlsx) file.

2. (Optional) Upload last year’s assignment file to avoid repeats.

3. Automatically generates one-to-one Secret Santa assignments.

4. Download the result as a CSV file.

Tech Stack

1. React.js with Vite

2. Excel parsing with xlsx

3. CSV file generation with file-saver

Use the App

1. Upload the Current Year Employee List.

2. (Optional) Upload the Previous Year Assignments.

3. Click "Generate Secret Santa List".

4. A CSV file will automatically download with this format:

        Employee_Name

        Employee_EmailID

        Secret_Child_Name

        Secret_Child_EmailID

Installation

 git clone https://github.com/sandeep1298/Secret-Santa-App.git
 cd Secret-Santa-App

# Install dependencies
npm install

# Run the app
npm run dev

Testing 

# Test the app
npx vitest run