export const bgGradient = `bg-gradient-to-b from-[#e0f2ff] via-[#f0f7ff] to-[#ffffff]

    dark:bg-gradient-to-tr dark:from-[#181818] dark:via-[#121212] dark:to-[#262626]/20`;
export const selectItem = `hover:bg-gray-100 hover:shadow-md hover:scale-101 duration-300 transition-all ease-in-out dark:hover:bg-gray-900`;
 export const toastmsg = `fixed right-4 bottom-20 lg:bottom-4 z-50
             flex items-center gap-3
             bg-green-600 text-white font-medium 
             px-5 py-3 rounded-xl shadow-lg
             animate-slide-in`
  export const errormsg = `${toastmsg} !bg-red-600`;
  export const searchableFields = ['name', 'description', 'permissions', 'value', 'firstName', 
    'lastName', 'phone', 'date', 'time','bookedBy', 'notes', 'bookedAt', 'customerName', 'date', 'time'];
      
  export const dropdownClass = `flex capitalize flex-row gap-2 ${selectItem}`

 	export const gender = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' }
	];
 
  
  
    import { encodeBase32LowerCase } from '@oslojs/encoding';
  

 export function generateUserId() {
      // ID with 120 bits of entropy, or about the same as UUID v4.
      const bytes = crypto.getRandomValues(new Uint8Array(15));
      const id = encodeBase32LowerCase(bytes);
      return id;
  }
  
export function extractUsername(email: string) {
    if (typeof email !== "string") {
      throw new Error("Input must be a string");
    }
  
    // Find the part before the '@'
    const atIndex = email.indexOf("@");
    
    if (atIndex === -1) {
      throw new Error("Invalid email address: missing '@'");
    }
  
    return email.substring(0, atIndex);
  }