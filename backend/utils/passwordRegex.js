// Password must contain at least:
// - 1 uppercase letter
// - 1 lowercase letter
// - 1 number
// - 1 special character (@$!%*?&#)
// - Minimum 8 characters
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export default passwordRegex;
