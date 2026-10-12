/**
 * User guides and manuals — sourced from the official COMSATS Junaid Zaidi Library
 * website navigation: https://library.comsats.edu.pk/
 *
 * Listed under the "User Guides/Manuals" dropdown.
 */

export interface UserGuide {
  /** Official guide name from the website */
  name: string;
  /** Brief summary of what the guide covers */
  description: string;
  /** Whether it's a video tutorial */
  isVideo: boolean;
  /** Target audience */
  audience: 'all' | 'faculty' | 'student' | 'phd';
}

/**
 * Guides and manuals listed on the official website.
 */
export const officialUserGuides: UserGuide[] = [
  {
    name: 'Video Tutorial for VPN Configuration',
    description: 'Step-by-step video guide for configuring VPN to access HEC digital resources off-campus.',
    isVideo: true,
    audience: 'all',
  },
  {
    name: 'Library Handbook',
    description: 'Comprehensive guide covering library policies, services, facilities, and usage guidelines.',
    isVideo: false,
    audience: 'all',
  },
  {
    name: 'Turnitin User Guide',
    description: 'Instructions for using Turnitin plagiarism detection software for thesis and research work.',
    isVideo: false,
    audience: 'faculty',
  },
  {
    name: 'VPN User Guide',
    description: 'General VPN setup guide for accessing subscribed digital resources from outside campus.',
    isVideo: false,
    audience: 'all',
  },
  {
    name: 'VPN User Guide for Mac',
    description: 'Platform-specific VPN configuration instructions for macOS users.',
    isVideo: false,
    audience: 'all',
  },
  {
    name: 'VPN User Guide for Windows 8',
    description: 'Platform-specific VPN configuration instructions for Windows 8 users.',
    isVideo: false,
    audience: 'all',
  },
  {
    name: 'VPN User Guide for Windows 7',
    description: 'Platform-specific VPN configuration instructions for Windows 7 users.',
    isVideo: false,
    audience: 'all',
  },
  {
    name: 'How to Write a PhD Thesis',
    description: 'Guidelines and structure for writing a doctoral thesis at COMSATS University Islamabad.',
    isVideo: false,
    audience: 'phd',
  },
  {
    name: 'Guidelines for Writing MS Thesis',
    description: 'Instructions and formatting requirements for Master’s thesis preparation.',
    isVideo: false,
    audience: 'student',
  },
];
