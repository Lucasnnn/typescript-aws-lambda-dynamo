export class Client {
  fullName?: string;
  dateOfBirth?: string;
  isActive?: boolean;
  addresses?: string[];
  contacts?: Contact[];

  constructor(
    fullName?: string,
    dateOfBirth?: string,
    isActive?: boolean,
    addresses?: string[],
    contacts?: Contact[]
  ) {
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.isActive = isActive;
    this.addresses = addresses;
    this.contacts = contacts;
  }
}

export interface Contact {
  email: string;
  phone: string;
  isPrimary: boolean;
}
