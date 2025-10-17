
type Checks = {
    len: boolean;
    lower: boolean;
    upper: boolean;
    digit: boolean;
    special: boolean;
  };
  
  export function getPasswordChecks(pwd: string): Checks {
    return {
      len: pwd.length >= 6,                  // match your Identity options
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      digit: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
  }