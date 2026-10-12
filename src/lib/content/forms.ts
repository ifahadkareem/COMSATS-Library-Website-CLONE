/**
 * Library forms — sourced from the official COMSATS Junaid Zaidi Library
 * website navigation: https://library.comsats.edu.pk/
 *
 * These form names appear under the "Forms" dropdown on the official website.
 */

export interface LibraryForm {
  /** Official form name from the website */
  name: string;
  /** Brief description of purpose */
  description: string;
  /** Whether a downloadable/file version exists */
  downloadable: boolean;
}

/**
 * Forms listed on the official website.
 */
export const officialForms: LibraryForm[] = [
  {
    name: 'VPN Request Form',
    description: 'Request VPN access to use HEC digital library resources from off-campus.',
    downloadable: true,
  },
  {
    name: 'WiFi Password Set / Reset Form',
    description: 'Set or reset your WiFi password for campus network access.',
    downloadable: true,
  },
  {
    name: 'Library Membership Form',
    description: 'Apply for or renew library membership.',
    downloadable: true,
  },
  {
    name: 'Book/s Purchase Request Form',
    description: 'Suggest books for the library to acquire.',
    downloadable: true,
  },
  {
    name: 'SDI Inquiry Form',
    description: 'Selective Dissemination of Information — request customized current awareness alerts.',
    downloadable: true,
  },
  {
    name: 'Turnitin Form',
    description: 'Submit requests for plagiarism detection via Turnitin.',
    downloadable: true,
  },
  {
    name: 'Writeup Submission Form for Plagiarism',
    description: 'Submit your writeup for plagiarism checking before thesis/dissertation submission.',
    downloadable: true,
  },
];
