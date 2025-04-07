import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as fileUtils from '../utils/fileUtils';

// Mock alert
global.alert = vi.fn();

// Sample valid data
const validData = [
  { Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' },
  { Employee_Name: 'Bob', Employee_EmailID: 'bob@example.com' },
];

// Sample missing field data
const missingData = [
  { Employee_Name: 'Alice' }, // Missing EmailID
];

describe('Secret Santa Validations', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('alerts on missing required fields', async () => {
    vi.spyOn(fileUtils, 'parseExcelFile').mockResolvedValueOnce(missingData);
    render(<App />);

    const upload = screen.getByLabelText(/Upload Current Year/i);
    const file = new File(['dummy'], 'missing.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    await waitFor(() => fireEvent.change(upload, { target: { files: [file] } }));

    expect(global.alert).toHaveBeenCalledWith(
      'Missing required fields: Employee_Name or Employee_EmailID.'
    );
  });

  test('alerts if same file uploaded for both current and previous', async () => {
    vi.spyOn(fileUtils, 'parseExcelFile').mockResolvedValue(validData);
    render(<App />);

    const uploadCurrent = screen.getByLabelText(/Upload Current Year/i);
    const uploadPrevious = screen.getByLabelText(/Previous Year/i);

    const file = new File(['dummy'], 'same.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    await waitFor(() => fireEvent.change(uploadCurrent, { target: { files: [file] } }));
    await waitFor(() => fireEvent.change(uploadPrevious, { target: { files: [file] } }));

    expect(global.alert).toHaveBeenCalledWith(
      'Previous assignment file cannot be the same as current employee list.'
    );
  });

  test('accepts valid file and stores data', async () => {
    vi.spyOn(fileUtils, 'parseExcelFile').mockResolvedValueOnce(validData);
    render(<App />);

    const upload = screen.getByLabelText(/Upload Current Year/i);
    const file = new File(['dummy'], 'valid.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    await waitFor(() => fireEvent.change(upload, { target: { files: [file] } }));

    // Generate button should now be enabled
    expect(screen.getByText(/Generate Secret Santa List/i)).toBeEnabled();
  });
});
