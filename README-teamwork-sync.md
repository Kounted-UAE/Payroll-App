# Teamwork Excel Sync Tool

This tool allows you to sync bulk changes from your Excel file (`lib/all-tasks-source.xlsx`) back to Teamwork.com tasks efficiently and safely.

## Features

✅ **Batch Processing** - Handles thousands of tasks with proper rate limiting  
✅ **Change Detection** - Only updates tasks that have actually changed  
✅ **Error Handling** - Comprehensive error logging and recovery  
✅ **Field Mapping** - Maps Excel columns to Teamwork API fields  
✅ **Date Normalization** - Handles Excel date formats properly  
✅ **Priority Mapping** - Converts text priorities to numbers  
✅ **Progress Validation** - Ensures progress values are 0-100  
✅ **Detailed Logging** - Shows exactly what's being changed  
✅ **Error Reporting** - Saves detailed error logs for troubleshooting

## Setup

1. **Environment Variables**: Your existing environment variables are already configured:
   - `TEAMWORK_SITE` - Your Teamwork site URL
   - `TEAMWORK_PROJECT_API_KEY` - Your API key

2. **Excel File**: Ensure your Excel file is at `lib/all-tasks-source.xlsx` with these columns:
   - `ID` (required) - Teamwork task ID
   - `Task name` - Task title
   - `Description` - Task description
   - `Due date` - Task due date
   - `Priority` - Task priority (Low/Medium/High or 1/2/3)
   - `Status` - Task status
   - `Progress` - Task progress (0-100)
   - `Tags` - Comma-separated tags

## Usage

Run the sync script:
```bash
npm run sync-teamwork
```

Or directly:
```bash
npx tsx scripts/sync-teamwork-tasks.ts
```

## Field Mapping

| Excel Column | Teamwork Field | Notes |
|--------------|----------------|-------|
| Task name | content | Task title |
| Description | description | Task description |
| Due date | due-date | Auto-converts Excel dates |
| Priority | priority | Maps text to numbers (Low=1, Medium=2, High=3) |
| Status | status | Task status |
| Progress | progress | Percentage (0-100) |
| Tags | tags | Comma-separated values |

## Rate Limiting

The script includes built-in rate limiting:
- **Batch Size**: 10 tasks per batch
- **Request Delay**: 500ms between individual requests
- **Batch Delay**: 2 seconds between batches

This ensures compliance with Teamwork API limits and prevents overwhelming the server.

## Error Handling

If errors occur, the script will:
1. Continue processing remaining tasks
2. Log all errors to a timestamped JSON file
3. Provide a detailed summary at the end
4. Show specific error messages for troubleshooting

## Common Issues

- **Task not found**: Verify the ID exists in Teamwork
- **Authentication failed**: Check your API key and site URL
- **Rate limiting**: The script handles this automatically
- **Invalid dates**: Check Excel date format consistency
- **Network issues**: Script will retry and log failures

## Example Output

```
🚀 Starting Excel to Teamwork sync...
📂 Reading Excel file: ./lib/all-tasks-source.xlsx
📊 Found 150 tasks in Excel file
📋 Available columns: ID, Task name, Description, Due date, Priority, Status, Progress

🎯 Processing 150 tasks in 15 batches...

📦 Processing batch 1 (10 tasks)...
🔍 Checking task 12345...
  📝 Change detected in Priority: "2" → "3"
  📝 Change detected in Due date: "2025-01-15" → "2025-01-20"
  🚀 Updating task 12345 with 2 changes...
  ✅ Task 12345 updated successfully

📊 Batch 1 Summary: ✅ 7 updated, ⏭️ 2 skipped, ❌ 1 errors

============================================================
📋 FINAL SYNC SUMMARY
============================================================
✅ Tasks updated: 98
⏭️ Tasks skipped (no changes): 45
❌ Tasks with errors: 7
📊 Total tasks processed: 150
📈 Success rate: 65.3%
============================================================
```

## Safety Notes

- The script only updates fields that have actually changed
- It never deletes tasks or irreversible actions
- All errors are logged with task IDs for easy troubleshooting
- Rate limiting prevents overwhelming the Teamwork API
- You can stop the script at any time with Ctrl+C

## Workflow

1. **Export tasks** from Teamwork to Excel (you've already done this)
2. **Edit the Excel file** with your bulk changes
3. **Run the sync script** to push changes back to Teamwork
4. **Review the summary** and error logs if any
5. **Verify changes** in Teamwork interface

The script is designed to be safe and efficient - it will show you exactly what it's doing before making any changes!
