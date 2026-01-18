export interface SignatureFormData {
  name: string;
  title: string;
  company: string;
  website: string;
  phone: string;
  twitter: string;
  linkedin: string;
  logoUrl: string;
}

export const initialFormData: SignatureFormData = {
  name: "",
  title: "",
  company: "",
  website: "",
  phone: "",
  twitter: "",
  linkedin: "",
  logoUrl: "",
};
