import {
  TextIcon, FileTextIcon, CheckSquareIcon, SignatureIcon,
  TypeIcon, MinusIcon, ImageIcon, DatabaseIcon
} from 'lucide-react';

export const ELEMENT_CATEGORIES = [
  {
    category: 'Interactive Elements',
    types: [
      { value: 'text', label: 'Variable Field (Input)', icon: <TextIcon size={18} />, color: 'bg-purple-50 border-purple-200 hover:border-purple-500 hover:bg-purple-100' },
      { value: 'system-text', label: 'Variable Field (System)', icon: <DatabaseIcon size={18} />, color: 'bg-purple-50 border-purple-200 hover:border-purple-500 hover:bg-purple-100' },
      { value: 'checkbox', label: 'Checkbox', icon: <CheckSquareIcon size={18} />, color: 'bg-purple-50 border-purple-200 hover:border-purple-500 hover:bg-purple-100' },
      { value: 'signature', label: 'Signature', icon: <SignatureIcon size={18} />, color: 'bg-purple-50 border-purple-200 hover:border-purple-500 hover:bg-purple-100' }
    ]
  },
  {
    category: 'Text Elements',
    types: [
      { value: 'heading', label: 'Heading', icon: <TypeIcon size={18} />, color: 'bg-orange-50 border-orange-200 hover:border-orange-500 hover:bg-orange-100' },
      { value: 'textarea', label: 'Paragraph', icon: <FileTextIcon size={18} />, color: 'bg-orange-50 border-orange-200 hover:border-orange-500 hover:bg-orange-100' },
      { value: 'subheading', label: 'Subheading', icon: <TypeIcon size={18} />, color: 'bg-orange-50 border-orange-200 hover:border-orange-500 hover:bg-orange-100' }
    ]
  },
  {
    category: 'Decorative Elements',
    types: [
      { value: 'image', label: 'Image/Logo', icon: <ImageIcon size={18} />, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' },
      { value: 'divider', label: 'Divider', icon: <MinusIcon size={18} />, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' },
      { value: 'rectangle', label: 'Rectangle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' },
      { value: 'circle', label: 'Circle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' },
      { value: 'triangle', label: 'Triangle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 L22 20 L2 20 Z"/></svg>, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' },
      { value: 'semicircle', label: 'Semicircle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 A9 9 0 0 1 21 12 Z"/></svg>, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' },
      { value: 'arrow', label: 'Arrow', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, color: 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100' }
    ]
  }
];

export const SYSTEM_VARIABLES = [
  'Member ID',
  'Contract Number',
  'Contract Start Date',
  'Contract End Date',
  'Minimum Term',
  'Training Start Date',
  'Contract Type',
  'Contract Cost',
  'Termination Notice Period',
  'Contract Renewal Duration',
  'Contribution Adjustment',
  'SEPA mandate reference'
];

export const USER_VARIABLES = [
  'Salutation',
  'Member First Name',
  'Member Last Name',
  'Street & Number',
  'ZIP Code',
  'City',
  'Telephone number',
  'Mobile number',
  'Email Address',
  'Date of Birth',
  'Account Holder (Bank)',
  'Credit institution',
  'IBAN',
  'BIC'
];
