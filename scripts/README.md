# Medical Labs Data Scraper

This script fetches medical laboratory data from Google Places API and exports it to a CSV file.

## Setup

1. **Ensure you have your Google Places API key**:
   - Add it to `.env.local`:
     ```
     GOOGLE_PLACES_API_KEY=your_api_key_here
     ```

2. **Load environment variables** (Windows PowerShell):
   ```powershell
   # Load the .env.local file
   Get-Content .env.local | ForEach-Object {
     if ($_ -match '^([^=]+)=(.+)$') {
       [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
     }
   }
   ```

3. **Run the script**:
   ```bash
   node scripts/fetch-labs-to-csv.js
   ```

## Output

The script will create a file called `medical_labs_data.csv` in your project root with the following columns:

- **Name**: Lab/hospital name
- **Address**: Full address
- **City**: City/town
- **State**: State
- **Phone Number**: Contact number
- **Website**: Official website URL
- **Google Maps URL**: Direct link to Google Maps
- **Plus Code**: Google Plus Code location
- **Rating**: Google rating (out of 5)
- **Review Count**: Number of reviews
- **Latitude**: GPS latitude
- **Longitude**: GPS longitude
- **Opening Hours**: Full weekly schedule
- **Types**: Place types (e.g., hospital, medical_lab, etc.)

## Customization

To search in different locations, edit the `SEARCH_LOCATIONS` array in the script:

```javascript
const SEARCH_LOCATIONS = [
  { city: 'Your City', state: 'Your State' },
  // Add more locations...
];
```

## Notes

- The script searches for "medical laboratory diagnostic center" in each location
- It automatically removes duplicate entries
- There's a 1-second delay between requests to avoid rate limiting
- Each location can return up to 20 results
