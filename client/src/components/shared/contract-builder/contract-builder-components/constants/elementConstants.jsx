import {
  TextIcon, FileTextIcon, CheckSquareIcon, SignatureIcon,
  TypeIcon, MinusIcon, ImageIcon, DatabaseIcon
} from 'lucide-react';

export const ELEMENT_CATEGORIES = [
  {
    category: 'contractBuilder.elements.interactiveElements',
    types: [
      { value: 'text', label: 'contractBuilder.elements.variableFieldInput', icon: <TextIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'system-text', label: 'contractBuilder.elements.variableFieldSystem', icon: <DatabaseIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'checkbox', label: 'contractBuilder.elements.checkbox', icon: <CheckSquareIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'signature', label: 'contractBuilder.elements.signature', icon: <SignatureIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' }
    ]
  },
  {
    category: 'contractBuilder.elements.textElements',
    types: [
      { value: 'heading', label: 'contractBuilder.elements.heading', icon: <TypeIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'textarea', label: 'contractBuilder.elements.paragraph', icon: <FileTextIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'subheading', label: 'contractBuilder.elements.subheading', icon: <TypeIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' }
    ]
  },
  {
    category: 'contractBuilder.elements.decorativeElements',
    types: [
      { value: 'image', label: 'contractBuilder.elements.imageLogo', icon: <ImageIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'divider', label: 'contractBuilder.elements.divider', icon: <MinusIcon size={18} />, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'rectangle', label: 'contractBuilder.elements.rectangle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'circle', label: 'contractBuilder.elements.circle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'triangle', label: 'contractBuilder.elements.triangle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 L22 20 L2 20 Z"/></svg>, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'semicircle', label: 'contractBuilder.elements.semicircle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 A9 9 0 0 1 21 12 Z"/></svg>, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' },
      { value: 'arrow', label: 'contractBuilder.elements.arrow', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, color: 'bg-surface-hover border border-border hover:border-primary hover:bg-surface-button-hover' }
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

// Variable label overrides for admin panel context
export const ADMIN_VARIABLE_MAP = {
  'Member ID': 'Customer ID',
  'Training Start Date': 'Access Start Date',
  'Member First Name': 'Studio Owner First Name',
  'Member Last Name': 'Studio Owner Last Name',
};

// Translation key mapping for variable display names
export const VARIABLE_TRANSLATION_KEYS = {
  'Member ID': 'contractBuilder.variables.memberId',
  'Contract Number': 'contractBuilder.variables.contractNumber',
  'Contract Start Date': 'contractBuilder.variables.contractStartDate',
  'Contract End Date': 'contractBuilder.variables.contractEndDate',
  'Minimum Term': 'contractBuilder.variables.minimumTerm',
  'Training Start Date': 'contractBuilder.variables.trainingStartDate',
  'Contract Type': 'contractBuilder.variables.contractType',
  'Contract Cost': 'contractBuilder.variables.contractCost',
  'Termination Notice Period': 'contractBuilder.variables.noticePeriod',
  'Contract Renewal Duration': 'contractBuilder.variables.renewalDuration',
  'Contribution Adjustment': 'contractBuilder.variables.contributionAdjustment',
  'SEPA mandate reference': 'contractBuilder.variables.sepaMandate',
  'Salutation': 'contractBuilder.variables.salutation',
  'Member First Name': 'contractBuilder.variables.firstName',
  'Member Last Name': 'contractBuilder.variables.lastName',
  'Street & Number': 'contractBuilder.variables.street',
  'ZIP Code': 'contractBuilder.variables.zipCode',
  'City': 'contractBuilder.variables.city',
  'Telephone number': 'contractBuilder.variables.telephone',
  'Mobile number': 'contractBuilder.variables.mobile',
  'Email Address': 'contractBuilder.variables.email',
  'Date of Birth': 'contractBuilder.variables.dateOfBirth',
  'Account Holder (Bank)': 'contractBuilder.variables.accountHolder',
  'Credit institution': 'contractBuilder.variables.creditInstitution',
  'IBAN': 'contractBuilder.variables.iban',
  'BIC': 'contractBuilder.variables.bic',
  // Admin overrides
  'Customer ID': 'contractBuilder.adminVariables.customerId',
  'Access Start Date': 'contractBuilder.adminVariables.accessStartDate',
  'Studio Owner First Name': 'contractBuilder.adminVariables.ownerFirstName',
  'Studio Owner Last Name': 'contractBuilder.adminVariables.ownerLastName',
};
