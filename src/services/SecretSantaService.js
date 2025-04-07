import * as XLSX from "xlsx";

class SecretSantaService {
  constructor(currentData, previousAssignments = []) {
    this.employees = currentData;
    this.previousAssignments = previousAssignments;
    this.assignments = new Map();
  }

  generateAssignments() {
    const all = [...this.employees];
    const recipients = [...this.employees];

    for (const giver of all) {
      const options = recipients.filter(
        (r) =>
          r.email !== giver.email &&
          !this._isPreviousAssignment(giver.email, r.email)
      );

      if (options.length === 0) throw new Error("No valid assignments possible");

      const randomIndex = Math.floor(Math.random() * options.length);
      const chosen = options[randomIndex];

      this.assignments.set(giver.email, chosen);
      recipients.splice(recipients.indexOf(chosen), 1);
    }

    return this._formatAssignments();
  }

  _isPreviousAssignment(giverEmail, recipientEmail) {
    return this.previousAssignments.some(
      (prev) =>
        prev.Employee_EmailID === giverEmail &&
        prev.Secret_Child_EmailID === recipientEmail
    );
  }

  _formatAssignments() {
    return this.employees.map((giver) => {
      const receiver = this.assignments.get(giver.email);
      return {
        Employee_Name: giver.name,
        Employee_EmailID: giver.email,
        Secret_Child_Name: receiver.name,
        Secret_Child_EmailID: receiver.email,
      };
    });
  }
}

export default SecretSantaService;
