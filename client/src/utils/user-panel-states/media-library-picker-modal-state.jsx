// Media Library Shared State
// This file contains the centralized data for the Media Library Picker Modal
// Used by: Notes, Bulletin Board, and any other component that uses MediaLibraryPickerModal

export const mediaLibraryFolders = [
  { id: 'all', name: 'All Designs', color: '#6b7280', isSystem: true },
  { id: 'social', name: 'Social Media', color: '#3b82f6' },
  { id: 'promo', name: 'Promotions', color: '#ef4444' },
  { id: 'events', name: 'Events', color: '#8b5cf6' },
  { id: 'general', name: 'General', color: '#22c55e' },
]

export const mediaLibraryDesigns = [
  {
    id: 1,
    name: 'Summer Promo Banner',
    folderId: 'promo',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 2,
    name: 'Fitness Challenge Post',
    folderId: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 3,
    name: 'New Equipment Announcement',
    folderId: 'general',
    thumbnail: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=225&fit=crop',
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 4,
    name: 'Holiday Schedule',
    folderId: 'events',
    thumbnail: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=225&fit=crop',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 5,
    name: 'Member Welcome Post',
    folderId: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop',
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 6,
    name: 'Weekend Special Offer',
    folderId: 'promo',
    thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=225&fit=crop',
    createdAt: Date.now() - 86400000 * 14,
  },
]
